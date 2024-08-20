import { getFirestore } from '@/lib/admin'
import { queueMessage } from '@/services/message-service'
import { deviceTokenConverter } from '@/types/device-token-firebase'
import { randomUUID } from 'crypto'
import { logger } from 'firebase-functions/v2'

// todo メッセージをキューに登録する関数
export const queueTodoMessage = async (
  uid: string,
  scheduledAt: Date,
  title: string,
  body: string
): Promise<string | undefined> => {
  const userRef = getFirestore()
    .collection(`users/${uid}/device-tokens`)
    .withConverter(deviceTokenConverter)
  const userSnapshot = await userRef.listDocuments()

  const tokens = userSnapshot.map((doc) => doc.id)

  let taskId = undefined
  if (tokens.length > 0 && scheduledAt.getTime() > new Date().getTime()) {
    logger.info('now creating task ... ' + JSON.stringify(tokens))
    taskId = randomUUID()
    await queueMessage(taskId, scheduledAt, {
      title,
      body,
      tokens
    })
  }
  return taskId
}
