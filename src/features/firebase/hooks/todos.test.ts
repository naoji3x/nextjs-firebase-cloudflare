import 'cross-fetch/polyfill'

import useTodos from '@/features/firebase/hooks/todos'
import { renderHook } from '@testing-library/react'

import {
  getTestEnv,
  initializeTestEnvironment
} from 'tests/rules/firestore/utils'

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

jest.mock('firebase/firestore', () => {
  const actual =
    jest.requireActual<typeof import('firebase/firestore')>(
      'firebase/firestore'
    )
  return {
    __esModule: true,
    ...actual,
    onSnapshot: jest.fn((collection, callback) => {
      // モックのデータを定義
      const mockData = {
        docs: [
          {
            id: '1',
            data: () => ({
              uid: 'dummy-user-id',
              title: 'title',
              instruction: 'instruction',
              scheduledAt: new Date(),
              done: false
            })
          }
        ]
      }
      // コールバックを呼び出す
      callback(mockData)
      return () => {} // Unsubscribe function
    })
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
  })

  afterEach(async () => {
    await getTestEnv().clearFirestore()
  })

  afterAll(async () => {
    await getTestEnv().cleanup()
  })

  it('fetches todos', async () => {
    const { result } = renderHook(() => useTodos(userId))
    expect(result.current.todos.length).toBe(1)
  })
})
