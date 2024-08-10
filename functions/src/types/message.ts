import { z } from 'zod'

export const messageSchema = z.object({
  title: z.string().optional(),
  body: z.string(),
  tokens: z.array(z.string())
})
export type Message = z.infer<typeof messageSchema>
