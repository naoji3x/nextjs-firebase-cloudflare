import { Message } from '@/types/message'
import { getFunctions } from 'firebase-admin/functions'
import { getMessaging } from 'firebase-admin/messaging'
import { logger } from 'firebase-functions/v2'
import { getFunctionUrl } from './tasks'

// メッセージを送信する
export const sendMessage = async (message: Message) => {
  logger.info('now sending messages : ' + JSON.stringify(message))
  const res = await getMessaging().sendEachForMulticast({
    notification: { title: message.title, body: message.body },
    tokens: message.tokens
  })

  logger.info(
    'finish sending message : successCount = ' +
      res.successCount +
      ', failureCount = ' +
      res.failureCount +
      `, ${JSON.stringify(res.responses)}`
  )
}

// メッセージをキューに登録する
export const queueMessage = async (
  id: string, // タスクのID
  scheduleTime: Date, // タスクの実行予定時刻
  message: Message, // 送信するメッセージ
  region = 'asia-northeast1', // リージョン
  funcName = 'message-task' // 関数名
) => {
  const queue = getFunctions().taskQueue(
    `locations/${region}/functions/${funcName}`
  )
  const targetUri = await getFunctionUrl(funcName, region)
  const func = queue.enqueue(message, { scheduleTime, uri: targetUri, id })
  await Promise.all([func])
}

// タスクの削除
export const deleteTask = async (
  id: string, // タスクのID
  region = 'asia-northeast1', // リージョン
  funcName = 'message-task' // 関数名
): Promise<void> => {
  const queue = getFunctions().taskQueue(
    `locations/${region}/functions/${funcName}`
  )
  const func = queue.delete(id)
  await Promise.all([func])
}
