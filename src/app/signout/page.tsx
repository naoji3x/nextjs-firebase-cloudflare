'use client'
import { signOut } from '@/features/firebase/lib/google-auth'
import { useEffect } from 'react'

//
// firestoreのsnapshotを使っている画面等で、直接singOut関数を呼び出すと、
// unsubscribeが呼ばれずにログアウトしてエラーになるため、一度このページにリダイレクトしてからログアウト処理を行う。
//
const SignOut = () => {
  useEffect(() => {
    const func = async () => {
      await signOut()
    }
    func()
  }, [])

  return (
    <div
      className="h-screen w-screen flex justify-center items-center flex-col space-y-10"
      aria-label="signing out ..."
    />
  )
}
export default SignOut
