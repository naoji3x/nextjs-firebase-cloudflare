import { firebaseEnv } from '@/features/firebase/env.mjs'
import {
  initializeTestEnvironment as _initializeTestEnvironment,
  RulesTestEnvironment
} from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'
import { fn } from 'jest-mock'

let testEnv: RulesTestEnvironment

export const initializeTestEnvironment = async (projectId: string) => {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
  const testEnv = await _initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8')
    }
  })
  return testEnv
}

jest.mock('@/features/firebase/client', () => ({
  firestore: fn(),
  auth: fn(),
  function: fn(),
  storage: fn(),
  firebase: fn(),
  firebaseConfig: fn()
}))

export const initializeMockEnvironment = async (
  userId: string
): Promise<RulesTestEnvironment> => {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
  const projectId = firebaseEnv.NEXT_PUBLIC_PROJECT_ID
  console.log(projectId)

  const mockEnv = await _initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8')
    }
  })

  jest.mock('@/features/firebase/client', () => ({
    firestore: mockEnv.authenticatedContext(userId).firestore()
  }))

  return mockEnv
}
