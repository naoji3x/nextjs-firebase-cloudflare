import { getAuth } from '@/features/firebase/client'
import { signOut as signOutFirebase } from 'firebase/auth'
import {
  signIn as signInWith,
  signOut as signOutNextAuth
} from 'next-auth/react'

/**
 * Sign in with Google.
 */
export const signIn = async () => await signInWith('google')

/**
 * Sign out from the app.
 * @param callbackUrl redirect URL after sign out
 */
export const signOut = async (callbackUrl = '/') => {
  const auth = getAuth()
  if (auth.currentUser) {
    await signOutFirebase(auth)
  }
  await signOutNextAuth({ redirect: true, callbackUrl })
}
