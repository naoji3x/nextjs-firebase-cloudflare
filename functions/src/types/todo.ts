import { FirestoreDataConverter, Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'
import { firebaseTimestamps, timestamps, WithId } from './utils'

const base = {
  title: z.string().optional(),
  instruction: z.string(),
  done: z.boolean(),
  image: z.string().optional(),
  taskId: z.string().optional()
}

export const todoFirebaseSchema = z.object({
  scheduledAt: z.instanceof(Timestamp),
  ...base,
  ...firebaseTimestamps
})
export const todoSchema = z.object({
  scheduledAt: z.date(),
  ...base,
  ...timestamps
})

export const todoInputSchema = z.object({
  scheduledAt: z.date(),
  ...base
})

export type TodoFirebase = z.infer<typeof todoFirebaseSchema>
export type Todo = WithId<z.infer<typeof todoSchema>>
export type TodoInput = z.infer<typeof todoInputSchema>

export const todoConverter: FirestoreDataConverter<Todo> = {
  // date型は直接firestoreに保存できないが、Timestamp型に自動で変換される。
  toFirestore: (todo) => {
    return todo as Omit<Todo, 'id'>
  },
  // date型をTimestampから元に戻す。
  fromFirestore: (snapshot) => {
    const data = snapshot.data()
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
