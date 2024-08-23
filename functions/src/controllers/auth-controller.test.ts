import { getAuth } from '@/controllers/auth-controller'
import { HttpsError } from 'firebase-functions/v2/https'

describe('auth-controller', () => {
  it('should return auth', async () => {
    const auth = {
      uid: 'dummy-uid',
      token: {
        name: 'dummy-name',
        email: 'dummy-email'
      }
    }
    const result = getAuth(auth)
    expect(result).toEqual(auth)
  })

  it('should throw https error if auth is undefined', async () => {
    try {
      getAuth(undefined)
    } catch (e) {
      expect(e).toBeInstanceOf(HttpsError)
      const error = e as HttpsError
      expect(error.message).toBe('auth is undefined')
      expect(error.code).toBe('unauthenticated')
    }
  })

  it('should throw https error with no argument', async () => {
    try {
      getAuth()
    } catch (e) {
      expect(e).toBeInstanceOf(HttpsError)
      const error = e as HttpsError
      expect(error.message).toBe('auth is undefined')
      expect(error.code).toBe('unauthenticated')
    }
  })
})
