'use strict'

self.addEventListener('push', (event) => {
  const payload = event.data.json()

  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  }

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  )
})
