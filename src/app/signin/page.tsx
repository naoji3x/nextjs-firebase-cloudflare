'use client'
import { signIn } from '#features/firebase/api/google-auth'
import { useEffect } from 'react'

const SignIn = () => {
  useEffect(() => {
    const func = async () => {
      await signIn()
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
export default SignIn
