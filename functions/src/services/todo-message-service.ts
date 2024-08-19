import { getFirestore } from '@/lib/admin'
import { queueMessage } from '@/services/message-service'
import { randomUUID } from 'crypto'
import { logger } from 'firebase-functions/v2'

// todo メッセージをキューに登録する関数
export const queueTodoMessage = async (
  uid: string,
  scheduledAt: Date,
  title: string,
  body: string
): Promise<string | undefined> => {
  logger.info('now queueing message ...')

  const userRef = getFirestore().collection('users').doc(uid)
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
        await queueMessage(taskId, scheduledAt, {
          title,
          body,
          tokens
        })
      }
    }
  }
  return taskId
}
