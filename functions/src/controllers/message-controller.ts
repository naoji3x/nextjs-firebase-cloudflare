import * as messageService from '@/services/message-service'
import { Auth } from '@/types/auth'
import { Message } from '@/types/message'

// メッセージを送信する関数
export const sendMessage = async (message?: Message, auth?: Auth) => {
  if (!auth) return
  if (!message) return
  await messageService.sendMessage(message)
}

// メッセージを送信するタスク
export const messageTaskOptions = {
  retryConfig: {
    maxAttempts: 5,
    minBackoffSeconds: 60
  },
  rateLimits: {
    maxConcurrentDispatches: 6
  }
}

export const messageTask = async (message: Message) =>
  await messageService.sendMessage(message)
