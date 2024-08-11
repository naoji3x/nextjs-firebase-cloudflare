import {
  initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing'
import { renderHook } from '@testing-library/react'
import { readFileSync } from 'fs'
import { fn } from 'jest-mock'
import { firebaseEnv } from '../env.mjs'
import useTodos from './todos'

jest.mock('../client', () => ({
  firestore: fn(),
  auth: fn(),
  function: fn(),
  storage: fn(),
  firebase: fn(),
  firebaseConfig: fn()
}))

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
let testEnv: RulesTestEnvironment

describe('useTodos', () => {
  const userId = 'dummy-user-id'
  const projectId = firebaseEnv.NEXT_PUBLIC_PROJECT_ID

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId,
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8')
      }
    })

    jest.mock('../client', () => ({
      firestore: testEnv.authenticatedContext(userId).firestore()
    }))
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
