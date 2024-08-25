import { fn } from '@storybook/test'

export const onMessageReceived = fn()

export const getFcmToken = fn(
  async (checkSupportAndRegisterServiceWorker: boolean) => {
    return 'dummy-token'
  }
)
