import { randomUUID } from 'crypto'
import { Firestore } from 'firebase-admin/firestore'
import * as logger from 'firebase-functions/logger'
import { DocumentSnapshot } from 'firebase-functions/v2/firestore'
import { isDeepStrictEqual } from 'util'
import * as messageService from '../services/message-service'

// todo メッセージをキューに登録する関数
const queueMessage = async (
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

// Firestoreのデータを作成する際に、taskを登録する。
export const todoCreated = async (
  firestore: Firestore,
  uid: string,
  todoId: string,
  snapshot?: DocumentSnapshot
) => {
  if (!snapshot) return null
  const scheduledAt = snapshot?.data()?.scheduledAt
  if (!scheduledAt) {
    return null
  }

  const taskId = await queueMessage(
    firestore,
    uid,
    scheduledAt.toDate(),
    snapshot?.data()?.title,
    snapshot?.data()?.instruction
  )

  return taskId ? await snapshot.ref.set({ taskId }, { merge: true }) : null
}

// Firestoreのデータを書き換える際に、必要に応じてtaskを再登録する。
export const todoUpdated = async (
  firestore: Firestore,
  uid: string,
  todoId: string,
  snapshotBefore?: DocumentSnapshot,
  snapshotAfter?: DocumentSnapshot
) => {
  const before = {
    scheduledAt: snapshotBefore?.data()?.scheduledAt,
    title: snapshotBefore?.data()?.title,
    instruction: snapshotBefore?.data()?.instruction
  }

  const after = {
    scheduledAt: snapshotAfter?.data()?.scheduledAt,
    title: snapshotAfter?.data()?.title,
    instruction: snapshotAfter?.data()?.instruction
  }

  if (isDeepStrictEqual(before, after)) {
    return null
  }

  let taskId = snapshotBefore?.data()?.taskId
  if (taskId) {
    await messageService.deleteTask(taskId)
  }
  taskId = await queueMessage(
    firestore,
    uid,
    after.scheduledAt.toDate(),
    after.title,
    after.instruction
  )

  return taskId
    ? await snapshotAfter?.ref.set({ taskId }, { merge: true })
    : null
}

// Firestoreのデータを削除するときに、関連するタスクを削除する。
export const todoDeleted = async (snapshot?: DocumentSnapshot) => {
  const taskId = snapshot?.data()?.taskId
  if (taskId) {
    await messageService.deleteTask(taskId)
  }
}
