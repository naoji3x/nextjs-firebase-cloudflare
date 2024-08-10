import { getMessaging, onMessage } from 'firebase/messaging'
import { useEffect, useState } from 'react'
import { firebaseApp } from '../client'

export type Message = {
  messageId: string
  receivedAt: Date
  notification?: {
    title?: string
    body?: string
  }
  data?: {
    type?: string
    operation?: string
    userId?: number
    targetId?: number
  }
}

export const useMessage = () => {
  const [message, setMessage] = useState<Message | null>(null)

  useEffect(() => {
    const messaging = getMessaging(firebaseApp)
    const unsubscribe = onMessage(messaging, (payload) => {
      const notification = payload?.notification
      const data = payload?.data
      console.log('[useMessage] Message Received. ', JSON.stringify(payload))
      if (payload?.messageId) {
        setMessage({
          messageId: payload?.messageId,
          receivedAt: new Date(),
          notification: {
            title: notification?.title ?? undefined,
            body: notification?.body ?? undefined
          },
          data: {
            type: data?.type ?? undefined,
            operation: data?.operation ?? undefined,
            userId: data?.userId ? Number.parseInt(data?.userId) : undefined,
            targetId: data?.targetId
              ? Number.parseInt(data?.targetId)
              : undefined
          }
        })
      }
    })
    return () => {
      unsubscribe() // Unsubscribe from the onMessage event
    }
  }, [])

  return { message }
}
