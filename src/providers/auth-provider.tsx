'use client'

import { auth as firebaseAuth } from '@/features/firebase/client'
import { signOut } from '@/features/firebase/lib/google-auth'
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithCredential
} from 'firebase/auth'
import { useSession } from 'next-auth/react'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

type UserContext = {
  name: string
  email: string
  uid: string
  photoUrl?: string | null
}

export type UserContextType = UserContext | null | undefined

const AuthContext = createContext<UserContextType>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userContext, setUserContext] = useState<UserContextType>()
  const { data: session = null } = useSession()

  const toUserContext = (user: FirebaseUser): UserContext => ({
    name: user.displayName || '',
    email: user.email || '',
    uid: user.uid,
    photoUrl: user.photoURL || ''
  })

  useEffect(() => {
    if (session) {
      console.log('you are: ' + JSON.stringify(session.user))
      if (firebaseAuth.currentUser) {
        // サインインしている場合はユーザー情報を設定する。
        setUserContext(toUserContext(firebaseAuth.currentUser))
      } else {
        // サインインしていない場合はサインインしてユーザー情報を取得する。
        const func = async () => {
          try {
            // ログイン情報を保持する
            setPersistence(firebaseAuth, browserLocalPersistence)
            const cred = GoogleAuthProvider.credential(session?.user.id_token)
            await signInWithCredential(firebaseAuth, cred)
            if (firebaseAuth.currentUser) {
              setUserContext(toUserContext(firebaseAuth.currentUser))
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
        func()
      }
    }
  }, [session])

  return (
    <AuthContext.Provider value={userContext}>
      {userContext ? (
        children
      ) : (
        <div
          className="h-screen w-screen flex justify-center items-center flex-col space-y-10"
          aria-label="読み込み中"
        >
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = (): UserContextType => useContext(AuthContext)
