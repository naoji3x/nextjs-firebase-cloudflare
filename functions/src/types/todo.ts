import { Timestamp } from 'firebase-admin/firestore'
import { todoBase } from 'shared/types/todo'
import { z } from 'zod'
import { timestampsFirebase } from './timestamps-firebase'

export const todoFirebaseSchema = z.object({
  scheduledAt: z.instanceof(Timestamp),
  ...todoBase,
  ...timestampsFirebase
})

export type TodoFirebase = z.infer<typeof todoFirebaseSchema>
