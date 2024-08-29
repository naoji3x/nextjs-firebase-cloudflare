import { UserContext } from '@/features/firebase/api/google-auth'
import { fn } from '@storybook/test'

const userContext = {
  name: 'Dummy User',
  email: 'dummy.user@example.com',
  uid: 'test-user-uid'
}

export const signedInUser = fn(() => userContext)
export const signInWithGoogle = fn(
  async (idToken: string, signedIn: (user: UserContext) => void) => {
    signedIn(userContext)
  }
)
export const signOut = fn()

export const signIn = fn()
