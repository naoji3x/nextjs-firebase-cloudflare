import { z } from 'zod'

export const messageSchema = z.object({
  title: z.string().optional(),
  body: z.string(),
  tokens: z.array(z.string())
})
export type Message = z.infer<typeof messageSchema>

export const sendingMessageSchema = z.object({
  title: z.string().optional(),
  body: z.string(),
  tokens: z.array(z.string())
})
export type SendingMessage = z.infer<typeof sendingMessageSchema>

export const receivedMessageSchema = z.object({
  messageId: z.string(),
  receivedAt: z.date(),
  notification: z.object({
    title: z.string().optional(),
    body: z.string().optional()
  }),
  data: z.any().optional()
})

export type ReceivedMessage = z.infer<typeof receivedMessageSchema>
