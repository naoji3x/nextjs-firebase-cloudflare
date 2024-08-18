/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import * as authController from '@/controllers/auth-controller'
import * as helloController from '@/controllers/hello-controller'
import * as messageController from '@/controllers/message-controller'
import * as todoTrigger from '@/triggers/todo-trigger'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { TaskQueue } from 'firebase-admin/functions'
import * as functions from 'firebase-functions'
import * as logger from 'firebase-functions/logger'
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated
} from 'firebase-functions/v2/firestore'
import { onCall } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2/options'
import { onTaskDispatched } from 'firebase-functions/v2/tasks'
import { Auth } from 'shared/types/auth'
import { SendingMessage } from 'shared/types/message'

// 関数の中では環境変数が使えるが、トップレベルでは使えない。
// regionは固定値で設定する。環境変数から読み込もうとしたが、エラーになる。
const region = 'asia-northeast1'

// v2のregionを設定
setGlobalOptions({ region })
initializeApp()
// エミュレータはtaskに対応していないため、エミュレーターの場合はログに出力する。
if (process.env.FUNCTIONS_EMULATOR) {
  Object.assign(TaskQueue.prototype, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enqueue: (data: any, params: any) =>
      logger.info('enqueue tasks: ', data, params),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete: (data: any) => logger.info('delete tasks: ', data)
  })
}

const firestore = getFirestore()
firestore.settings({ ignoreUndefinedProperties: true })

// 以下の関数は、v1の関数のサンプル
export const helloWorld = functions.region(region).https.onCall(() => {
  const message = 'Hello world!'
  logger.info(region + ':' + message + ':' + new Date().toLocaleString())
  return message
})

// 以下の関数は、v2の関数のサンプル。関数名に大文字が使えないが、最後のexportの定義でケバブケースにする。
const helloWorldV2 = onCall<void, string>((request) =>
  helloController.helloWorldV2(request.auth)
)

const helloWorldKebab = onCall<void, string>((request) =>
  helloController.helloWorldKebab(request.auth)
)

// Functionに渡された認証情報を取得する関数
const getAuth = onCall<void, Auth | null>((request) =>
  authController.getAuth(request.auth)
)

// メッセージを送信する関数
const sendMessage = onCall<SendingMessage, void>(
  async (request) =>
    await messageController.sendMessage(request.data, request.auth)
)

// メッセージを送信するタスク
const scheduleMessage = onTaskDispatched<SendingMessage>(
  messageController.messageTaskOptions,
  async (request) => await messageController.messageTask(request.data)
)

// Firestoreのデータを作成する際に、createdAtとupdatedAtを挿入する。
const todoCreated = onDocumentCreated(
  'users/{uid}/todos/{todoId}',
  async (event) =>
    await todoTrigger.todoCreated(
      firestore,
      event.params.uid,
      event.params.todoId,
      event.data
    )
)

// Firestoreのデータを書き換える際に、updatedAtを更新する。
const todoUpdated = onDocumentUpdated(
  'users/{uid}/todos/{todoId}',
  async (event) =>
    await todoTrigger.todoUpdated(
      firestore,
      event.params.uid,
      event.params.todoId,
      event.data?.before,
      event.data?.after
    )
)

// Firestoreのデータを削除するときに、関連するタスクを削除する。
const todoDeleted = onDocumentDeleted(
  'users/{uid}/todos/{todoId}',
  async (event) => await todoTrigger.todoDeleted(event.data)
)

// ** note **
// firebase functions v1では関数名に大文字が使えるが、v2からは使えない。
// ケバブケースにするためには、関数名をオブジェクトに入れる。
// 関数をエクスポートする際に、オブジェクトに入れることで、ケバブケースにできる。
export const hello = { world: { kebab: helloWorldKebab, v2: helloWorldV2 } }
export const auth = { get: getAuth }
export const message = {
  send: sendMessage,
  task: scheduleMessage
}
export const todo = {
  created: todoCreated,
  updated: todoUpdated,
  deleted: todoDeleted
}
