/** @jest-environment node */
import { getAuth, helloWorldKebab } from '@/features/firebase/api/functions'
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

describe('functions', () => {
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

  it('should return hello world kebab', async () => {
    const result = await helloWorldKebab()
    console.log(result)
    expect(result).not.toBeNull()
  })

  it('should return null', async () => {
    const result = await getAuth()
    console.log(result)
    expect(result).toBeNull()
  })
})
