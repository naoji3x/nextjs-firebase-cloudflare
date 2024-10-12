'use strict'

importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.5.0/firebase-messaging.js')

// eslint-disable-next-line no-undef
importScripts('./sw-env.js')
console.log('NEXT_PUBLIC_API_KEY = ' + process.env.NEXT_PUBLIC_API_KEY)

// こちらはブラウザでバックグラウンドで通知を受け取るためのファイルです。

if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID
  }
  firebase.initializeApp(firebaseConfig)
}

firebase.messaging()

//background notifications will be received here
firebase.messaging().onBackgroundMessage(async (message) => {
  if (Notification.permission === 'granted') {
    if (navigator.serviceWorker)
      navigator.serviceWorker.getRegistration().then(async function (reg) {
        if (reg) {
          // firebase.message().useServiceWorker(reg)
          await reg.showNotification(message.notification.title, {
            body: message.notification.body
          })
        }
      })
  }
})
