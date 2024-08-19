import * as messageService from '@/services/message-service'
import { queueTodoMessage } from '@/services/todo-message-service'
import { todoFirebaseSchema } from '@/types/todo'
import { DocumentSnapshot } from 'firebase-functions/v2/firestore'

// Firestoreのデータを作成する際に、taskを登録する。
export const todoCreated = async (uid: string, snapshot?: DocumentSnapshot) => {
  if (!snapshot) return null

  const scheduledAt = snapshot?.data()?.scheduledAt
  if (!scheduledAt) {
    return null
  }

  const taskId = await queueTodoMessage(
    uid,
    scheduledAt.toDate(),
    snapshot?.data()?.title || 'todoApp',
    snapshot?.data()?.instruction || 'todoApp Instruction'
  )

  return taskId ? await snapshot.ref.set({ taskId }, { merge: true }) : null
}

// Firestoreのデータを書き換える際に、必要に応じてtaskを再登録する。
export const todoUpdated = async (
  uid: string,
  snapshotBefore?: DocumentSnapshot,
  snapshotAfter?: DocumentSnapshot
) => {
  const parsedDataBefore = todoFirebaseSchema.safeParse(snapshotBefore?.data())
  if (!parsedDataBefore.success) {
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

  // まだ予定が実施されていないものは、関連するタスクを削除する。
  const now = new Date()
  if (todoBefore.scheduledAt.toDate().getTime() > now.getTime()) {
    if (todoBefore?.taskId) {
      await messageService.deleteTask(todoBefore?.taskId)
    }
  }

  let taskId = null
  if (todoAfter.scheduledAt.toDate().getTime() > now.getTime()) {
    taskId = await queueTodoMessage(
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
