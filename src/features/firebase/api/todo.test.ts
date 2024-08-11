/** @jest-environment node */
// https://stackoverflow.com/questions/75890427/firestore-rules-tests-always-ends-with-timeout-error

import { addTodo } from '@/features/firebase/api/todo'
import { RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { addDoc, collection } from 'firebase/firestore'
import { initializeMockEnvironment } from 'tests/rules/firestore/utils'

const getFirestoreMock = jest.fn()

jest.mock('@/features/firebase/client', () => {
  const client = jest.requireActual<
    typeof import('@/features/firebase/client')
  >('@/features/firebase/client')
  return {
    __esModule: true,
    ...client,
    getFirestore: () => getFirestoreMock()
  }
})

let mockEnv: RulesTestEnvironment

describe('todo', () => {
  const userId = 'dummy-user-id'
  beforeAll(async () => {
    mockEnv = await initializeMockEnvironment()
  })

  beforeEach(async () => {
    getFirestoreMock.mockReturnValue(
      mockEnv.authenticatedContext(userId).firestore()
    )
  })

  afterEach(async () => {
    await mockEnv.clearFirestore()
  })

  afterAll(async () => {
    await mockEnv.cleanup()
  })

  it('add data by calling addTodo', async () => {
    const todo = {
      uid: userId,
      title: 'title',
      instruction: 'instruction',
      scheduledAt: new Date(),
      done: false,
      imageFile: undefined
    }
    const docRef = await addTodo(todo)
    expect(docRef.id).not.toBeNull()
  })

  it('add data', async () => {
    const firestore = mockEnv.authenticatedContext(userId).firestore()
    const todo = {
      uid: userId,
      title: 'title',
      instruction: 'instruction',
      scheduledAt: new Date(),
      done: false
    }
    const collectionName = (uid: string) => `users/${uid}/todos`
    const docRef = await addDoc(
      collection(firestore, collectionName(userId)),
      todo
    )
    expect(docRef.id).not.toBeNull()
  })
})
