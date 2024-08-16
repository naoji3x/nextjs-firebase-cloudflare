/** @jest-environment node */
// https://stackoverflow.com/questions/75890427/firestore-rules-tests-always-ends-with-timeout-error
import {
  deleteDeviceToken,
  listDeviceTokens,
  upsertDeviceToken
} from '@/features/firebase/api/device-token'
import { randomUUID } from 'crypto'
import {
  getTestEnv,
  initializeTestEnvironment
} from 'tests/rules/rules-test-helper'

const getFirestoreMock = jest.fn()

jest.mock('@/features/firebase/client', () => {
  const client = jest.requireActual('@/features/firebase/client')
  return {
    ...client,
    getFirestore: () => getFirestoreMock()
  }
})

describe('device token', () => {
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

  it('should add and list a device token and delete', async () => {
    const token = randomUUID()

    const deviceToken = await upsertDeviceToken(userId, token)
    expect(deviceToken).toBeTruthy()
    expect(deviceToken?.id).toBe(token)

    const tokens = await listDeviceTokens(userId)
    expect(tokens?.length).toBe(1)

    await deleteDeviceToken(userId, token)
    const tokensAfterDelete = await listDeviceTokens(userId)
    expect(tokensAfterDelete?.length).toBe(0)
  })
})
