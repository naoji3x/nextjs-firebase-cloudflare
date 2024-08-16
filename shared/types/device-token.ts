import { z } from 'zod'
import { timestamps } from './timestamps'
import { WithId } from './with-id'

export const deviceTokenBase = {}

export const deviceTokenSchema = z.object({
  ...deviceTokenBase,
  ...timestamps
})

export const deviceTokenInputSchema = z.object({
  ...deviceTokenBase
})

export type DeviceToken = WithId<z.infer<typeof deviceTokenSchema>>
export type DeviceTokenInput = z.infer<typeof deviceTokenInputSchema>
