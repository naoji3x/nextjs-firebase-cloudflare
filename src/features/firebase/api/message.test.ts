import { onMessageReceived } from '@/features/firebase/api/message'
import { ReceivedMessage } from '@/types'

jest.mock('@/features/firebase/client', () => {
  return {
    getFirebaseApp: jest.fn()
  }
})

let onMessageCallback = (payload: ReceivedMessage) => {}
const fireChange = (message: ReceivedMessage) => onMessageCallback(message)

jest.mock('firebase/messaging', () => {
  return {
    getMessaging: jest.fn(),
    onMessage: jest.fn().mockImplementation((_, callback) => {
      onMessageCallback = callback
      return jest.fn()
    })
  }
})

describe('todo', () => {
  const userId = 'dummy-user-id'

  it('should receive a message', () => {
    let message: ReceivedMessage | null = null
    const unsubscribe = onMessageReceived((newMessage) => {
      message = newMessage
    })

    expect(message).toBeNull()

    fireChange({
      messageId: 'id',
      receivedAt: new Date('1995-12-17T03:24:00'),
      notification: {
        title: 'title',
        body: 'body'
      },
      data: {
        userId: 'userId'
      }
    })
    expect(message).not.toBeNull()
    const newMessage = message!
    expect(newMessage.messageId).toBe('id')
    expect(newMessage.notification.title).toBe('title')
    expect(newMessage.data.userId).toBe('userId')

    fireChange({
      messageId: 'id2',
      receivedAt: new Date('1995-12-17T03:24:00'),
      notification: {
        title: 'title2',
        body: 'body2'
      }
    })
    const newMessage2 = message!
    expect(newMessage2.messageId).toBe('id2')
    expect(newMessage2.notification.body).toBe('body2')
    expect(newMessage2.data).toBeUndefined()

    unsubscribe()
  })
})
