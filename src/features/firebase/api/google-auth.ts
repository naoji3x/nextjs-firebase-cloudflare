import {
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  setPersistence,
  signInWithCredential,
  signOut as signOutFirebase
} from 'firebase/auth'
import { signOut as signOutNextAuth } from 'next-auth/react'
import { getAuth } from '../client'

export type UserContext = {
  name: string
  email: string
  uid: string
  photoUrl?: string | null
}

const toUser = (user: User): UserContext => ({
  name: user.displayName || '',
  email: user.email || '',
  uid: user.uid,
  photoUrl: user.photoURL || ''
})

/**
 * Sign in with Google.
 */
export const signIn = async (
  idToken: string,
  signedIn: (user: UserContext) => void
) => {
  try {
    const auth = getAuth()
    // ログイン情報を保持する
    setPersistence(auth, browserLocalPersistence)
    const cred = GoogleAuthProvider.credential(idToken)
    await signInWithCredential(auth, cred)
    const currentUser = auth.currentUser
    if (currentUser) {
      signedIn(toUser(auth.currentUser))
    } else {
      // エラー時はとにかくサインアウトする
      console.error('Failed to sign in')
      await signOut()
    }
  } catch (error) {
    // エラー時はとにかくサインアウトする
    console.error(error)
    await signOut()
  }
}

export const signedInUser = () => {
  const currentUser = getAuth().currentUser
  return currentUser ? toUser(currentUser) : null
}

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
