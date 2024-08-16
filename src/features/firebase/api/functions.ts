import { httpsCallable } from 'firebase/functions'
import { Auth } from 'shared/types/auth'
import { SendingMessage } from 'shared/types/message'
import { getFunctions } from '../client'

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
  const func = httpsCallable<SendingMessage, void>(
    getFunctions(),
    'message-send'
  )
  const message: SendingMessage = {
    title,
    body,
    tokens
  }
  await func(message)
}
