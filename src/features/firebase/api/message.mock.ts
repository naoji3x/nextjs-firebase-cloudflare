import { fn } from '@storybook/test'

export const onMessageReceived = fn()

export const getFcmToken = fn().mockReturnValue('test-fcm-token')
