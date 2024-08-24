import * as authController from '@/controllers/auth-controller'
import * as helloController from '@/controllers/hello-controller'
import * as messageController from '@/controllers/message-controller'
import { onCall } from 'firebase-functions/v2/https'
import { onTaskDispatched } from 'firebase-functions/v2/tasks'
import { Auth } from 'shared/types/auth'
import { SendingMessage } from 'shared/types/message'

// 以下の関数は、v2の関数のサンプル。関数名に大文字が使えないが、最後のexportの定義でケバブケースにする。
export const helloWorldV2 = onCall<void, string>((request) =>
  helloController.helloWorldV2(request.auth)
)

export const helloWorldKebab = onCall<void, string>((request) =>
  helloController.helloWorldKebab(request.auth)
)

// Functionに渡された認証情報を取得する関数
export const getAuth = onCall<void, Auth | null>((request) =>
  authController.getAuth(request.auth)
)

// メッセージを送信する関数
export const sendMessage = onCall<SendingMessage, void>(
  async (request) =>
    await messageController.sendMessage(request.data, request.auth)
)

// メッセージを送信するタスク
export const scheduleMessage = onTaskDispatched<SendingMessage>(
  messageController.messageTaskOptions,
  async (request) => await messageController.messageTask(request.data)
)
