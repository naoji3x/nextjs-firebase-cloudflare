import { getFirebaseApp } from '@/features/firebase/client'
import { getMessaging, onMessage } from 'firebase/messaging'
import { ReceivedMessage } from 'shared/types/message'

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
