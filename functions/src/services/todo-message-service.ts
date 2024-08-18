import * as messageService from '@/services/message-service'
import { randomUUID } from 'crypto'
import { Firestore } from 'firebase-admin/firestore'
import * as logger from 'firebase-functions/logger'

// todo メッセージをキューに登録する関数
export const queueTodoMessage = async (
  firestore: Firestore,
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
