import useTodos from '@/features/firebase/hooks/todos'
import { renderHook } from '@testing-library/react'

import { initializeTestEnvironment } from 'tests/rules/firestore/utils'

jest.mock('@/features/firebase/client', () => ({
  getFirestore: jest.fn()
}))

jest.mock('firebase/firestore', () => {
  const actual =
    jest.requireActual<typeof import('firebase/firestore')>(
      'firebase/firestore'
    )
  return {
    __esModule: true,
    ...actual,
    collection: jest.fn((firestore, path) => ({
      withConverter: jest.fn().mockReturnThis()
    })),
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

  it('fetches todos', async () => {
    const { result } = renderHook(() => useTodos(userId))
    expect(result.current.todos.length).toBe(1)
  })
})
