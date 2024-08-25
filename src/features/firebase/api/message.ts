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

export const getFcmToken = async (
  checkSupportAndRegisterServiceWorker: boolean
) => {
  if (checkSupportAndRegisterServiceWorker) {
    if (!(await isSupported())) {
      console.log("messaging isn't supported.")
      return null
    }
    console.log('messaging is supported.')
    // https://github.com/firebase/firebase-js-sdk/issues/7693
    navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/firebase-cloud-messaging-push-scope'
    })
  }

  const messaging = getMessaging(getFirebaseApp())
  const token = await getToken(messaging, {
    vapidKey: firebaseEnv.NEXT_PUBLIC_VAPID_KEY
  })
  return token
}
