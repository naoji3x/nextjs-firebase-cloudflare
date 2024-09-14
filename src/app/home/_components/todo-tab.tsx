'use client'

import {
  addTodo,
  deleteTodo,
  doTodo,
  getImageUrl
} from '#features/firebase/api/todo'
import DatePicker from '@/components/elements/date-picker'
import TimePicker from '@/components/elements/time-picker'
import TodoCard from '@/components/elements/todo-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTodos } from '@/hooks/todos'
import { useAuth } from '@/providers/auth-provider'
import { Label } from '@radix-ui/react-label'
import { useEffect, useState } from 'react'
import { Todo } from 'shared/types/todo'

const Card = ({
  todo,
  onDelete,
  onDone
}: {
  todo: Todo
  onDelete: (id: string) => void
  onDone: (id: string, done: boolean) => void
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)
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

const TodoTab = () => {
  const user = useAuth()
  const [titleValue, setTitleValue] = useState('')
  const [todoValue, setTodoValue] = useState('')
  const [file, setFile] = useState<File | undefined>(undefined)
  const [date, setDate] = useState<Date>(new Date())
  const [time, setTime] = useState<Date>(new Date())
  const { todos } = useTodos(user?.uid)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

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
      await addTodo(user.uid, {
        title: titleValue,
        instruction: todoValue,
        scheduledAt,
        done: false,
        ...(file ? { imageBlob: new Blob([file], { type: file.type }) } : {})
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
      doTodo(user.uid, id, done)
    } catch (e) {
      console.error('Error doneTodo: ', e)
    }
  }

  return (
    <>
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
    </>
  )
}

export default TodoTab
