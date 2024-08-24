import * as todoTrigger from '@/triggers/todo-trigger'
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated
} from 'firebase-functions/v2/firestore'

// Firestoreのデータを作成する際に、createdAtとupdatedAtを挿入する。
export const todoCreated = onDocumentCreated(
  'users/{uid}/todos/{todoId}',
  async (event) => await todoTrigger.todoCreated(event.params.uid, event.data)
)

// Firestoreのデータを書き換える際に、updatedAtを更新する。
export const todoUpdated = onDocumentUpdated(
  'users/{uid}/todos/{todoId}',
  async (event) =>
    await todoTrigger.todoUpdated(
      event.params.uid,
      event.data?.before,
      event.data?.after
    )
)

// Firestoreのデータを削除するときに、関連するタスクを削除する。
export const todoDeleted = onDocumentDeleted(
  'users/{uid}/todos/{todoId}',
  async (event) => await todoTrigger.todoDeleted(event.data)
)
