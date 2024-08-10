'use client'

import DatePicker from '@/components/elements/date-picker'
import TimePicker from '@/components/elements/time-picker'
import TodoCard from '@/components/elements/todo-card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  addTodo,
  deleteTodo,
  doneTodo,
  getImageUrl
} from '@/features/firebase/api/todo'
import { upsertToken } from '@/features/firebase/api/user'
import { functions } from '@/features/firebase/client'
import { useMessage } from '@/features/firebase/hooks/message'
import { useTodos } from '@/features/firebase/hooks/todos'
import { useSpeechToast } from '@/hooks/speech-toast'
import { useAuth } from '@/providers/auth-provider'
import { useMessaging } from '@/providers/messaging-provider'
import { Auth, Message, Todo, WithId } from '@/types'
import { Label } from '@radix-ui/react-label'
import { httpsCallable } from 'firebase/functions'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Card = ({
  todo,
  onDelete,
  onDone
}: {
  todo: WithId<Todo>
  onDelete: (id: string) => void
  onDone: (id: string, done: boolean) => void
}) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  useEffect(() => {
    const func = async () => setImageUrl(await getImageUrl(todo.image))
    func()
  }, [todo.image])

  return (
    <TodoCard
      id={todo.id}
      title={todo.title}
      instruction={todo.instruction}
      scheduledAt={todo.scheduledAt}
      done={todo.done}
      imageUrl={imageUrl}
      onDelete={(id: string) => onDelete(id)}
      onDone={(id, done) => onDone(id, done)}
    />
  )
}

const getAuth = async (): Promise<Auth | null> => {
  const response = await httpsCallable<void, Auth | null>(
    functions,
    'auth-get'
  )()
  return response.data
}

const sendMessage = async (
  title: string,
  body: string,
  token: string
): Promise<void> => {
  const func = httpsCallable<Message, void>(functions, 'message-send')
  const message: Message = {
    title,
    body,
    tokens: [token]
  }
  await func(message)
}

const Home = () => {
  const router = useRouter()
  const user = useAuth()
  const messaging = useMessaging()
  const { message } = useMessage()
  const [titleValue, setTitleValue] = useState('')
  const [todoValue, setTodoValue] = useState('')
  const [file, setFile] = useState<File | undefined>(undefined)
  const [messageValue, setMessageValue] = useState('')
  const [serverAuth, setServerAuth] = useState<Auth | null>(null)
  const [date, setDate] = useState<Date>(new Date())
  const [time, setTime] = useState<Date>(new Date())
  const { todos } = useTodos(user?.uid)
  const { setToastMessage } = useSpeechToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  // register fcm token
  useEffect(() => {
    if (!messaging || messaging.token === null || !user) return
    const token: string = messaging.token
    const func = async () => {
      console.log('requesting permission')
      await upsertToken(user.uid, token)
      console.log('getting token')
    }
    func()
  }, [messaging, user])

  // show toast message
  useEffect(() => {
    if (!message) return
    console.log('message: ', message)
    setToastMessage({
      title: message?.notification?.title,
      description: message?.notification?.body || ''
    })
  }, [message, setToastMessage])

  // handler for adding todo
  const handleAddTodo = async () => {
    if (todoValue === '' || !user) return
    try {
      const scheduledAt = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      )
      console.log('add todo', titleValue, todoValue, scheduledAt)
      await addTodo({
        uid: user.uid,
        title: titleValue,
        instruction: todoValue,
        scheduledAt,
        done: false,
        imageFile: file
      })
      setTitleValue('')
      setTodoValue('')
      setFile(undefined)
    } catch (e) {
      console.error('Error addTodo: ', e)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    if (!user) return
    console.log('delete todo', id)
    try {
      deleteTodo(user.uid, id)
    } catch (e) {
      console.error('Error deleteTodo: ', e)
    }
  }

  const handleDoneTodo = async (id: string, done: boolean) => {
    if (!user) return
    console.log('done todo', id, done)
    try {
      doneTodo(user.uid, id, done)
    } catch (e) {
      console.error('Error doneTodo: ', e)
    }
  }

  // handler for sending message
  const handleSendMessage = async () => {
    if (!messaging?.token || messageValue === '') return
    try {
      console.log('sending message : ' + messaging.token)
      await sendMessage('メッセージ', messageValue, messaging.token)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  // get server auth data
  useEffect(() => {
    const func = async () => {
      console.log('calling getAuth')
      const response = await httpsCallable<void, string>(
        functions,
        'hello-world-kebab'
      )()
      console.log('response', response)
      setServerAuth(await getAuth())
    }
    func()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-foreground text-background py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{user ? user.name : 'No user'}</h1>
          <Button variant={'secondary'} onClick={() => router.push('/signout')}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100">
        <section className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">やることの入力</h2>
          <Input
            className="rounded-full mb-2"
            placeholder="タイトル"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
          />
          <Input
            className="rounded-full mb-2"
            placeholder="やること"
            value={todoValue}
            onChange={(e) => setTodoValue(e.target.value)}
          />
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="picture">画像</Label>
            <Input id="picture" type="file" onChange={handleFileChange} />
          </div>

          <div className="py-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <DatePicker
              date={date}
              onSelect={(date) => setDate(date || new Date())}
            />
            <TimePicker
              date={time}
              onValueChange={(time) => setTime(time || new Date())}
            />
          </div>

          <div className="text-right my-3">
            <Button onClick={handleAddTodo} disabled={!todoValue}>
              保存
            </Button>
          </div>
          <h2 className="text-2xl font-semibold mb-4">
            firebase cloud messagingのテスト
          </h2>
          <Input
            className="rounded-full"
            placeholder="Message"
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
          />
          <div className="text-right my-3">
            <Button onClick={handleSendMessage} disabled={!messageValue}>
              メッセージ
            </Button>
          </div>

          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="Server Auth">
                <AccordionTrigger>Server Auth</AccordionTrigger>
                <AccordionContent>
                  {serverAuth ? (
                    <>
                      <div>{serverAuth.uid}</div>
                      <div>name: {serverAuth.name}</div>
                      <div>email: {serverAuth.email}</div>
                    </>
                  ) : (
                    'no auth data'
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="Token">
                <AccordionTrigger>Token</AccordionTrigger>
                <AccordionContent>
                  {messaging ? (
                    <div>{messaging.token}</div>
                  ) : (
                    'no messaging data'
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 text-center bg-white">
          <h2 className="text-2xl font-semibold mb-4">やることリスト</h2>

          <div className="flex flex-wrap justify-center">
            {todos.map((t) => (
              <div key={t.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <Card
                  todo={t}
                  onDelete={handleDeleteTodo}
                  onDone={handleDoneTodo}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full bg-foreground text-background  py-4">
        <div className="container mx-auto px-4 text-center">
          <p>nextjs-firebase-frontend</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
