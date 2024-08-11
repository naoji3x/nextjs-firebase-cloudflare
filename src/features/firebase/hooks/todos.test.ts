import { RulesTestEnvironment } from '@firebase/rules-unit-testing'
import { renderHook } from '@testing-library/react'
import { initializeMockEnvironment } from 'tests/rules/firestore/utils'
import useTodos from './todos'

let testEnv: RulesTestEnvironment

describe('useTodos', () => {
  const userId = 'dummy-user-id'
  beforeAll(async () => {
    testEnv = await initializeMockEnvironment(userId)
  })

  afterAll(async () => {
    await testEnv.cleanup()
  })

  it('fetches data', async () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos.length).toBeGreaterThanOrEqual(0)
    result.current.todos.map((todo) => {
      console.log(todo.instruction)
    })
  })
})
