import { getAuth } from '@/controllers/auth-controller'

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

  it('should return null', async () => {
    const result1 = getAuth(undefined)
    expect(result1).toBeNull()

    const result2 = getAuth()
    expect(result2).toBeNull()
  })
})
