import { Timestamp } from 'firebase-admin/firestore'
import { z } from 'zod'

export const timestampsFirebase = {
  createdAt: z.instanceof(Timestamp).optional(),
  updatedAt: z.instanceof(Timestamp).optional()
}
