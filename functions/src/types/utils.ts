import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'
export type WithId<T> = T & { id: string }

export const timestamps = {
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}

export const firebaseTimestamps = {
  createdAt: z.instanceof(Timestamp).optional(),
  updatedAt: z.instanceof(Timestamp).optional()
}
