import authConfig from '@/auth.config'
import { env } from '@/env.mjs'
import NextAuth from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: env.AUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, account }) {
      return { ...token, ...account }
    },
    async session({ session, token }) {
      session.user.id_token = token.id_token
      return session
    }
  },
  debug: process.env.NODE_ENV !== 'production'
})
