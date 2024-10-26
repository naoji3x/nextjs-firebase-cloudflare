'use strict'

importScripts(
  'https://www.gstatic.com/firebasejs/11.0.1/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/11.0.1/firebase-messaging-compat.js'
)

// eslint-disable-next-line no-undef
importScripts('./sw-env.js')

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
