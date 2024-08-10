import { signIn } from '@/auth'
import GoogleSignInButton from '@/components/elements/google-sign-in-button'
import { Shell } from '@/components/shells/shell'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account'
}

const SocialSignIn = () => {
  const handleSignIn = async () => {
    'use server'
    await signIn('google')
  }

  return (
    <section className="pb-2 bg-white">
      <div className="container mx-auto px-4">
        <Shell className="max-w-lg">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl mx-auto">
                あなたのアカウントで始めましょう！
              </CardTitle>
              <CardDescription className="mx-auto pt-2">
                Googleのアカウントで始められます。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid">
              <div className="flex items-center mx-auto">
                <form action={handleSignIn}>
                  <GoogleSignInButton type="submit" />
                </form>
              </div>
            </CardContent>
          </Card>
        </Shell>
      </div>
    </section>
  )
}

export default SocialSignIn
