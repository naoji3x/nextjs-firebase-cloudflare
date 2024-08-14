/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { Auth } from '@/types/auth'
import { Message } from '@/types/message'
import { randomUUID } from 'crypto'
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
import { isDeepStrictEqual } from 'util'
import * as messageService from './services/message-service'

// ** note **
// firebase functions v1では関数名に大文字が使えるが、v2からは使えない。
// ケバブケースにするためには、関数名をオブジェクトに入れる。

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

const helloWorldV2 = onCall<void, string>((request): string => {
  return (
    'Hello v2 world!: ' + request.auth?.uid + ',' + request.auth?.token.name ||
    '' + ',' + request.auth?.token.email ||
    ''
  )
})

// 以下の関数は、v2の関数のサンプル。関数名に大文字が使えないので、ケバブケースにする。
const helloWorldKebab = onCall<void, string>((request): string => {
  return 'Hello kebab world!: ' + request.auth?.uid
})

// Functionに渡された認証情報を取得する関数
const getAuth = onCall<void, Auth | null>((request): Auth | null => {
  if (request.auth) {
    return {
      uid: request.auth.uid,
      name: request.auth.token.name,
      email: request.auth.token.email
    }
  }
  return null
})

// メッセージを送信する関数
const sendMessage = onCall<Message, void>(async (request) => {
  if (!request.auth) return
  const message = request.data
  if (!message) return
  await messageService.sendMessage(message)
})

// メッセージを送信するタスク
const scheduleMessage = onTaskDispatched<Message>(
  {
    // region: region,
    retryConfig: {
      maxAttempts: 5,
      minBackoffSeconds: 60
    },
    rateLimits: {
      maxConcurrentDispatches: 6
    }
  },
  async (request) => await messageService.sendMessage(request.data)
)

const queueMessage = async (
  uid: string,
  scheduledAt: Date,
  title: string,
  body: string
): Promise<string | undefined> => {
  logger.info('now queueing message ...')

  const userRef = firestore.collection('users').doc(uid)
  const userSnapshot = await userRef.get()
  let taskId = undefined
  if (userSnapshot.exists) {
    logger.info(
      'now creating task ... ' + JSON.stringify(userSnapshot.get('tokens')),
      {
        structuredData: true
      }
    )
    const tokens = userSnapshot.get('tokens') || []
    if (tokens.length > 0) {
      if (scheduledAt > new Date()) {
        taskId = randomUUID()
        await messageService.queueMessage(taskId, scheduledAt, {
          title,
          body,
          tokens
        })
      }
    }
  }
  return taskId
}

// Firestoreのデータを作成する際に、createdAtとupdatedAtを挿入する。
const todoCreated = onDocumentCreated(
  '/users/{uid}/todos/{todoId}',
  async (event) => {
    const snapshot = event.data
    if (!snapshot) return null
    const scheduledAt = snapshot.data().scheduledAt
    if (!scheduledAt) {
      return null
    }

    const taskId = await queueMessage(
      event.params.uid,
      scheduledAt.toDate(),
      snapshot.data().title,
      snapshot.data().instruction
    )

    return taskId ? await snapshot.ref.set({ taskId }, { merge: true }) : null
  }
)

// Firestoreのデータを書き換える際に、updatedAtを更新する。
const todoUpdated = onDocumentUpdated(
  '/users/{uid}/todos/{todoId}',
  async (event) => {
    const before = {
      scheduledAt: event.data?.before.data().scheduledAt,
      title: event.data?.before.data().title,
      instruction: event.data?.before.data().instruction
    }

    const after = {
      scheduledAt: event.data?.after.data().scheduledAt,
      title: event.data?.after.data().title,
      instruction: event.data?.after.data().instruction
    }

    if (isDeepStrictEqual(before, after)) {
      return null
    }

    let taskId = event.data?.before.data().taskId
    if (taskId) {
      await messageService.deleteTask(taskId)
    }
    taskId = await queueMessage(
      event.params.uid,
      after.scheduledAt.toDate(),
      after.title,
      after.instruction
    )

    return taskId
      ? await event.data?.after.ref.set({ taskId }, { merge: true })
      : null
  }
)

// Firestoreのデータを削除するときに、関連するタスクを削除する。
const todoDeleted = onDocumentDeleted(
  '/users/{uid}/todos/{todoId}',
  async (event) => {
    const snapshot = event.data
    const taskId = snapshot?.data()?.taskId
    if (taskId) {
      await messageService.deleteTask(taskId)
    }
  }
)

// 関数をエクスポートする際に、オブジェクトに入れることで、ケバブケースにできる。
exports.hello = { world: { kebab: helloWorldKebab, v2: helloWorldV2 } }
exports.auth = { get: getAuth }
exports.message = { send: sendMessage, task: scheduleMessage }
exports.todo = {
  created: todoCreated,
  updated: todoUpdated,
  deleted: todoDeleted
}
