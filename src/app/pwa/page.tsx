'use client'

import GoogleSignInButton from '@/components/elements/google-sign-in-button'
import { env } from '@/env.mjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Index = () => {
  const router = useRouter()
  const handleSignIn = async () => {
    router.push('/signin')
  }

  return (
    <>
      <main>
        <div className="mx-auto max-w-md px-5 sm:px-2 pb-5 text-center content-center h-screen flex flex-col justify-center">
          <div className="relative w-64 h-64 mx-auto mb-32">
            <Image
              src="/images/icons/circle-icon-512x512.png"
              alt="Memory Watch"
              width={256}
              height={256}
              priority={true}
            />
          </div>
          <form
            action={handleSignIn}
            className="mx-auto text-center content-center flex flex-col justify-center"
          >
            <GoogleSignInButton type="submit" />
          </form>
          <p className="mt-4">Version {env.NEXT_PUBLIC_VERSION}</p>
        </div>
      </main>
    </>
  )
}

export default Index
