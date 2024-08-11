import { FirestoreDataConverter } from '@google-cloud/firestore'
import { z } from 'zod'
import { firebaseTimestamps, timestamps, WithId } from './utils'

const base = {
  tokens: z.array(z.string())
}

export const userFirebaseSchema = z.object({
  ...base,
  ...firebaseTimestamps
})
export const userSchema = z.object({
  ...base,
  ...timestamps
})

export type UserFirebase = z.infer<typeof userFirebaseSchema>
export type User = WithId<z.infer<typeof userSchema>>

export const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (user) => {
    return user as Omit<User, 'id'>
  },
  fromFirestore: (snapshot) => {
    const data = snapshot.data()
    const parsedData = userFirebaseSchema.safeParse(data)
    if (!parsedData.success) {
      throw new Error(parsedData.error.errors.map((e) => e.message).join('\n'))
    }
    const firestore = parsedData.data
    return {
      id: snapshot.id,
      ...firestore,
      createdAt: firestore.createdAt ? firestore.createdAt.toDate() : undefined,
      updatedAt: firestore.updatedAt ? firestore.updatedAt.toDate() : undefined
    }
  }
}
