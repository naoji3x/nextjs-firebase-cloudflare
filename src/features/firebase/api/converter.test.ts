/** @jest-environment node */
// https://stackoverflow.com/questions/75890427/firestore-rules-tests-always-ends-with-timeout-error
import { addTodo, getTodo } from '@/features/firebase/api/todo'
import {
  getTestEnv,
  initializeTestEnvironment
} from 'tests/rules/rules-test-helper'

const getFirestoreMock = jest.fn()
const getStorageMock = jest.fn()

jest.mock('@/features/firebase/client', () => {
  const client = jest.requireActual<
    typeof import('@/features/firebase/client')
  >('@/features/firebase/client')
  return {
    __esModule: true,
    ...client,
    getFirestore: () => getFirestoreMock(),
    getStorage: () => getStorageMock()
  }
})

describe('todo', () => {
  const userId = 'dummy-user-id'

  beforeAll(async () => {
    await initializeTestEnvironment()
  })

  beforeEach(async () => {
    getFirestoreMock.mockReturnValue(
      getTestEnv().authenticatedContext(userId).firestore()
    )
    getStorageMock.mockReturnValue(
      getTestEnv().authenticatedContext(userId).storage()
    )
  })

  afterEach(async () => {
    await getTestEnv().clearFirestore()
    await getTestEnv().clearStorage()
  })

  afterAll(async () => {
    await getTestEnv().cleanup()
  })

  it('should add a todo', async () => {
    const todo = {
      title: 'title',
      instruction: 'instruction',
      scheduledAt: new Date(),
      done: false
    }
    const id = await addTodo(userId, todo)
    expect(id).toBeTruthy()

    const newTodo = await getTodo(userId, id)
    console.log(newTodo)
  })
})
