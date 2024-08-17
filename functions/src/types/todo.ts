import { Timestamp } from 'firebase-admin/firestore'
import { todoBase } from 'shared/types/todo'
import { z } from 'zod'
import { firebaseTimestamps } from './timestamps'

export const todoFirebaseSchema = z.object({
  scheduledAt: z.instanceof(Timestamp),
  ...todoBase,
  ...firebaseTimestamps
})
