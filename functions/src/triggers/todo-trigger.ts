import * as messageService from '@/services/message-service'
import { todoFirebaseSchema } from '@/types/todo'
import { randomUUID } from 'crypto'
import { Firestore } from 'firebase-admin/firestore'
import * as logger from 'firebase-functions/logger'
import { DocumentSnapshot } from 'firebase-functions/v2/firestore'

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
    snapshot?.data()?.title || 'todoApp',
    snapshot?.data()?.instruction || 'todoApp Instruction'
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
  logger.info(snapshotBefore?.data())

  const parsedDataBefore = todoFirebaseSchema.safeParse(snapshotBefore?.data())
  if (!parsedDataBefore.success) {
    logger.info(parsedDataBefore.error.errors.map((e) => e.message).join('\n'))
    return null
  }
  const todoBefore = parsedDataBefore.data

  const parsedDataAfter = todoFirebaseSchema.safeParse(snapshotAfter?.data())
  if (!parsedDataAfter.success) {
    return null
  }
  const todoAfter = parsedDataAfter.data

  if (
    todoBefore.scheduledAt.isEqual(todoAfter.scheduledAt) &&
    todoBefore.title === todoAfter.title &&
    todoBefore.instruction === todoAfter.instruction
  ) {
    return null
  }

  logger.info(todoBefore)
  logger.info(todoAfter)

  // まだ予定が実施されていないものは、関連するタスクを削除する。
  const now = new Date()
  if (todoBefore.scheduledAt.toDate().getTime() > now.getTime()) {
    if (todoBefore?.taskId) {
      await messageService.deleteTask(todoBefore?.taskId)
    }
  }

  let taskId = null
  if (todoAfter.scheduledAt.toDate().getTime() > now.getTime()) {
    taskId = await queueMessage(
      firestore,
      uid,
      todoAfter.scheduledAt.toDate(),
      todoAfter.title || 'todoApp',
      todoAfter.instruction
    )
  }

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
