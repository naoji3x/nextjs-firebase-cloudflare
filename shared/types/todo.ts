import { z } from 'zod'
import { timestamps } from './timestamps'
import { WithId } from './with-id'

export const todoBase = {
  title: z.string().optional(),
  instruction: z.string(),
  done: z.boolean(),
  image: z.string().optional(),
  taskId: z.string().optional()
}

export const todoSchema = z.object({
  scheduledAt: z.date(),
  ...todoBase,
  ...timestamps
})

export const todoInputSchema = z.object({
  scheduledAt: z.date(),
  ...todoBase
})

export type Todo = WithId<z.infer<typeof todoSchema>>
export type TodoInput = z.infer<typeof todoInputSchema>
