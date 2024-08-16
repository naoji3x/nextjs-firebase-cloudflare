import { z } from 'zod'
export const timestamps = {
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}
