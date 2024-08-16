import { FirestoreDataConverter, Timestamp } from 'firebase/firestore'
import { Todo, todoBase } from 'shared/types/todo'
import { z } from 'zod'
import { timestampsFirebase } from './timestamp-firebase'
export const todoFirebaseSchema = z.object({
  scheduledAt: z.instanceof(Timestamp),
  ...todoBase,
  ...timestampsFirebase
})
export type TodoFirebase = z.infer<typeof todoFirebaseSchema>

export const todoConverter: FirestoreDataConverter<Todo> = {
  // date型は直接firestoreに保存できないが、Timestamp型に自動で変換される。
  toFirestore: (todo) => {
    delete todo.id
    return todo
  },
  // date型をTimestampから元に戻す。
  fromFirestore: (snapshot) => {
    const data = snapshot.data({ serverTimestamps: 'estimate' })
    const parsedData = todoFirebaseSchema.safeParse(data)
    if (!parsedData.success) {
      throw new Error(parsedData.error.errors.map((e) => e.message).join('\n'))
    }
    const firestore = parsedData.data
    return {
      id: snapshot.id,
      ...firestore,
      scheduledAt: firestore.scheduledAt.toDate(),
      createdAt: firestore.createdAt ? firestore.createdAt.toDate() : undefined,
      updatedAt: firestore.updatedAt ? firestore.updatedAt.toDate() : undefined
    }
  }
}
