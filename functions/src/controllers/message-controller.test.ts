import { messageTask, sendMessage } from '@/controllers/message-controller'
import { HttpsError } from 'firebase-functions/v2/https'
import { SendingMessage } from 'shared/types/message'

const sendMessageMock = jest.fn()

jest.mock('@/services/message-service', () => {
  return {
    sendMessage: (message: SendingMessage) => sendMessageMock(message),
    queueMessage: jest.fn(),
    deleteTask: jest.fn()
  }
})

describe('message-controller', () => {
  const auth = {
    uid: 'dummy-uid',
    token: {
      name: 'dummy-name',
      email: 'dummy-email'
    }
  }

  const message = {
    title: 'dummy-title',
    body: 'dummy-body',
    tokens: ['dummy-token']
  }

  it('should call sendMessage by sendMessage', async () => {
    await sendMessage(message, auth)
    expect(sendMessageMock).toHaveBeenCalledWith(message)
  })

  it('should call sendMessage by messageTask', async () => {
    await messageTask(message)
    expect(sendMessageMock).toHaveBeenCalledWith(message)
  })

  it('should throw https error if auth is undefined', async () => {
    try {
      await sendMessage(message, undefined)
    } catch (e) {
      expect(e).toBeInstanceOf(HttpsError)
      const error = e as HttpsError
      expect(error.message).toBe('auth is undefined')
      expect(error.code).toBe('unauthenticated')
    }
  })

  it('should throw https error if message is undefined', async () => {
    try {
      await sendMessage(undefined, auth)
    } catch (e) {
      expect(e).toBeInstanceOf(HttpsError)
      const error = e as HttpsError
      expect(error.message).toBe('message is undefined')
      expect(error.code).toBe('invalid-argument')
    }
  })
})
