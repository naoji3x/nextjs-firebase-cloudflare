import { getFirestore } from '@/lib/admin'
import { queueTodoMessage } from '@/services/todo-message-service'
import { randomUUID } from 'crypto'
import { Timestamp } from 'firebase-admin/firestore'
import firebaseFunctionsTest from 'firebase-functions-test'
import { SendingMessage } from 'shared/types/message'

let idResult: string | undefined
let scheduleTimeResult: Date | undefined
let messageResult: SendingMessage | undefined

const initialize = () => {
  idResult = undefined
  scheduleTimeResult = undefined
  messageResult = undefined
}

jest.mock('@/services/message-service', () => ({
  queueMessage: jest.fn().mockImplementation((id, scheduleTime, message) => {
    idResult = id
    scheduleTimeResult = scheduleTime
    messageResult = message
  })
}))

firebaseFunctionsTest({
  projectId: process.env.FUNCTIONS_PROJECT_ID
})

describe('todo-message-service', () => {
  const uid = randomUUID()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  it('should not queue a massage', async () => {
    initialize()
    await queueTodoMessage(uid, tomorrow, 'title', 'body')
    expect(idResult).toBeUndefined()
    expect(scheduleTimeResult).toBeUndefined()
    expect(messageResult).toBeUndefined()
  })

  it('should queue a massage', async () => {
    const docRef = getFirestore()
      .collection(`users/${uid}/device-tokens`)
      .doc('token1')
    await docRef.set({ createdAt: Timestamp.now(), updatedAt: Timestamp.now() })

    initialize()
    await queueTodoMessage(uid, tomorrow, 'title', 'body')
    expect(idResult).toBeDefined()
    expect(scheduleTimeResult).toEqual(tomorrow)
    expect(messageResult).toEqual({
      title: 'title',
      body: 'body',
      tokens: ['token1']
    })
  })

  it('should not queue a massage if scheduledAt = yesterday', async () => {
    initialize()
    await queueTodoMessage(uid, yesterday, 'title', 'body')
    expect(idResult).toBeUndefined()
    expect(scheduleTimeResult).toBeUndefined()
    expect(messageResult).toBeUndefined()
  })
})
