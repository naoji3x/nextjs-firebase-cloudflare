import { getFunctions } from '@/features/firebase/client'
import { Auth } from '@/types/auth'
import { Message } from '@/types/message'
import { httpsCallable } from 'firebase/functions'
// import { httpsCallable } from 'firebase/functions'

export const helloWorldKebab = async () =>
  (await httpsCallable<void, string>(getFunctions(), 'hello-world-kebab')())
    .data
export const helloWorldV2 = async () =>
  (await httpsCallable<void, string>(getFunctions(), 'hello-world-v2')()).data

export const getAuth = async (): Promise<Auth | null> =>
  (await httpsCallable<void, Auth | null>(getFunctions(), 'auth-get')()).data

export const sendMessage = async (
  title: string,
  body: string,
  tokens: string[]
): Promise<void> => {
  const func = httpsCallable<Message, void>(getFunctions(), 'message-send')
  const message: Message = {
    title,
    body,
    tokens
  }
  await func(message)
}
