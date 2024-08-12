import 'cross-fetch/polyfill'

import useTodos from '@/features/firebase/hooks/todos'
import { RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { renderHook } from '@testing-library/react'
import { initializeTestEnvironment } from 'tests/rules/firestore/utils'

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
    mockEnv = await initializeTestEnvironment()
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

  it('fetches data', async () => {
    const { result } = renderHook(() => useTodos(userId))
    expect(result.current.todos.length).toBeGreaterThanOrEqual(0)
    result.current.todos.map((todo) => {
      console.log(todo.instruction)
    })
  })
})
