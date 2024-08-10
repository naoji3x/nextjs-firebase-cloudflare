import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const firebaseEnv = createEnv({
  client: {
    NEXT_PUBLIC_API_KEY: z.string(),
    NEXT_PUBLIC_AUTH_DOMAIN: z.string(),
    NEXT_PUBLIC_PROJECT_ID: z.string(),
    NEXT_PUBLIC_STORAGE_BUCKET: z.string(),
    NEXT_PUBLIC_MESSAGING_SENDER_ID: z.string(),
    NEXT_PUBLIC_APP_ID: z.string(),
    NEXT_PUBLIC_VAPID_KEY: z.string(),
    NEXT_PUBLIC_USE_FIREBASE_EMULATORS: z.string().optional()
  },

  runtimeEnv: {
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    NEXT_PUBLIC_AUTH_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_STORAGE_BUCKET: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    NEXT_PUBLIC_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    NEXT_PUBLIC_VAPID_KEY: process.env.NEXT_PUBLIC_VAPID_KEY,
    NEXT_PUBLIC_USE_FIREBASE_EMULATORS:
      process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS
  }
})
