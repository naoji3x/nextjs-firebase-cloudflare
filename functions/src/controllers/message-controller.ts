import { sendMessage as _sendMessage } from '@/services/message-service'
import { HttpsError } from 'firebase-functions/v2/https'
import { Auth } from 'shared/types/auth'
import { SendingMessage } from 'shared/types/message'

// メッセージを送信する関数
export const sendMessage = async (message?: SendingMessage, auth?: Auth) => {
  if (!message) {
    throw new HttpsError('invalid-argument', 'message is undefined')
  }
  if (!auth) {
    throw new HttpsError('unauthenticated', 'auth is undefined')
  }
  await _sendMessage(message)
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

export const messageTask = async (message: SendingMessage) =>
  await _sendMessage(message)
