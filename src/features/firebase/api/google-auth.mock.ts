import { fn } from '@storybook/test'

const userContext = {
  name: 'Test User',
  email: 'test.user@email.com',
  uid: 'test-user-uid'
}

export const signedInUser = fn().mockReturnValue(userContext)
export const signIn = fn().mockImplementation(
  async (idToken: string, signedIn: (user: typeof userContext) => void) => {
    signedIn(userContext)
  }
)
export const signOut = fn()
