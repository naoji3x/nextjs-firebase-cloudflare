import { defaultCache } from '@serwist/next/worker'
import { initializeApp } from 'firebase/app'
import { MessagePayload } from 'firebase/messaging'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { Serwist } from 'serwist'

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache
})

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
}

initializeApp(firebaseConfig)
const messaging = getMessaging()

console.log('messaging : ' + JSON.stringify(messaging))

const notify = async (payload: MessagePayload) => {
  let messageTitle = 'Title'
  let messageBody = 'Message'

  if (payload.notification) {
    messageTitle = payload.notification.title || 'Title'
    messageBody = payload.notification.body || 'Message'
  } else if (payload.data) {
    messageTitle = payload.data.type
    messageBody = payload.data.operation
  }
  const notificationPromise = self.registration.showNotification(messageTitle, {
    body: messageBody
  })
  return notificationPromise
}

// 通知を受けとると push イベントが呼び出される。
self.addEventListener(
  'push',
  function (event) {
    const payload = event.data?.json()
    console.log(
      '[firebase-messaging-sw.js] Received foreground message ',
      JSON.stringify(payload)
    )
    event.waitUntil(notify(payload))
  },
  false
)

onBackgroundMessage(messaging, (payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    JSON.stringify(payload)
  )
  return notify(payload)
})

serwist.addEventListeners()
