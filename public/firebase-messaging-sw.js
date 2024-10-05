'use strict'

// eslint-disable-next-line no-undef
importScripts(
  'https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js'
)
// eslint-disable-next-line no-undef
importScripts(
  'https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js'
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
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

onBackgroundMessage(messaging, (payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  )
  const notificationTitle = 'Background Message Title'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
