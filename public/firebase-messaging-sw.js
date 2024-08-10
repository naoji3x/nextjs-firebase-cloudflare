'use strict'
// eslint-disable-next-line no-undef
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js'
)
// eslint-disable-next-line no-undef
importScripts(
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js'
)
// eslint-disable-next-line no-undef
importScripts('./sw-env.js')

// こちらはブラウザでバックグラウンドで通知を受け取るためのファイルです。

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
  // measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

console.log('messaging : ' + JSON.stringify(messaging))

const notify = async (payload) => {
  let messageTitle = 'Title'
  let messageBody = 'Message'

  if (payload.notification) {
    messageTitle = payload.notification.title
    messageBody = payload.notification.body
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
    const payload = event.data.json()
    console.log(
      '[firebase-messaging-sw.js] Received foreground message ',
      JSON.stringify(payload)
    )
    event.waitUntil(notify(payload))
  },
  false
)

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    JSON.stringify(payload)
  )
  return notify(payload)
})
