'use client'
import { signOut } from '#features/firebase/api/google-auth'
import { useRouter } from 'next/navigation'
// import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

//
// firestoreのsnapshotを使っている画面等で、直接singOut関数を呼び出すと、
// unsubscribeが呼ばれずにログアウトしてエラーになるため、一度このページにリダイレクトしてからログアウト処理を行う。
//
const SignOut = () => {
  const router = useRouter()
  const [signedOut, setSignedOut] = useState(false)
  useEffect(() => {
    const func = async () => {
      await signOut()
      setSignedOut(true)
    }
    func()
  }, [])

  useEffect(() => {
    if (signedOut) {
      router.push('/')
    }
  }, [signedOut, router])

  return (
    <div
      className="h-screen w-screen flex justify-center items-center flex-col space-y-10"
      aria-label="signing out ..."
    />
  )
}
export default SignOut
