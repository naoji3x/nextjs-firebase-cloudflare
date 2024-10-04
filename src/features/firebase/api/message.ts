import { env } from '@/env.mjs'
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage
} from 'firebase/messaging'
import { ReceivedMessage } from 'shared/types/message'
import { getFirebaseApp } from '../client'
import { firebaseEnv } from '../env.mjs'

export const onMessageReceived = (
  callback: (message: ReceivedMessage) => void
) => {
  const messaging = getMessaging(getFirebaseApp())
  const unsubscribe = onMessage(messaging, (payload) => {
    const notification = payload?.notification
    const data = payload?.data
    console.log(
      '[onMessageReceived] Message Received. ',
      JSON.stringify(payload)
    )
    if (payload?.messageId) {
      callback({
        messageId: payload?.messageId,
        receivedAt: new Date(),
        notification: {
          title: notification?.title ?? undefined,
          body: notification?.body ?? undefined
        },
        ...(data ? { data } : {})
      })
    }
  })

  return unsubscribe
}

export const isFcmSupported = async () => await isSupported()

export const getFcmToken = async () => {
  const messaging = getMessaging(getFirebaseApp())
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register(
      `/firebase-messaging-sw.js?v=${env.NEXT_PUBLIC_VERSION}`
    )
    console.log('Service Worker registered with scope:', registration.scope)
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      return await getToken(messaging, {
        vapidKey: firebaseEnv.NEXT_PUBLIC_VAPID_KEY,
        serviceWorkerRegistration: registration
      })
    }
  }
  throw new Error('The browser doesn`t support notification.')
}
