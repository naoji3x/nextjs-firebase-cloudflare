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
  const permission = await Notification.requestPermission()
  console.log('Notification permission:', permission)
  if (permission === 'granted') {
    const registration = await navigator.serviceWorker.ready
    console.log('registration', registration)
    const token = await getToken(messaging, {
      vapidKey: firebaseEnv.NEXT_PUBLIC_VAPID_KEY,
      serviceWorkerRegistration: registration
    })
    console.log('FCM token is ready')
    return token
  }
  throw new Error('The browser doesn`t support notification.')
}

export const requestFcmToken = async (callback: (fcmToken: string) => void) => {
  const messaging = getMessaging(getFirebaseApp())
  const registration = await navigator.serviceWorker.ready
  const token = await getToken(messaging, {
    vapidKey: firebaseEnv.NEXT_PUBLIC_VAPID_KEY,
    serviceWorkerRegistration: registration
  })
  console.log('FCM token is ready')
  callback(token)
}
