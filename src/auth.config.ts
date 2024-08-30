import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export default {
  providers: [Google],
  pages: { error: '/signin', signIn: '/signin', signOut: '/signout' }
} satisfies NextAuthConfig
