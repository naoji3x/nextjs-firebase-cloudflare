'use client'

import {
  signedInUser,
  signIn,
  UserContext
} from '#features/firebase/api/google-auth'
import { useSession } from 'next-auth/react'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'

export type UserContextType = UserContext | null | undefined

const AuthContext = createContext<UserContextType>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userContext, setUserContext] = useState<UserContextType>()
  const { data: session = null } = useSession()

  useEffect(() => {
    if (!session) {
      return
    }

    const currentUser = signedInUser()
    if (currentUser) {
      setUserContext(currentUser)
      return
    }
    signIn(session.user.id_token, (user) => setUserContext(user))
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
