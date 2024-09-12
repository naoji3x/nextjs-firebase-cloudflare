import NextAuth from 'next-auth'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

export const ROOT = '/'
export const AUTH_ROUTES = ['/signin', '/signout', '/error']
export const PUBLIC_ROUTES = ['/']
export const DEFAULT_REDIRECT = '/home'
export default auth((req) => {
  const { nextUrl } = req

  const isAuthenticated = !!req.auth
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname)
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)

  if (isAuthRoute) {
    return
  }

  if (isPublicRoute && isAuthenticated) {
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))
  }

  if (!isAuthenticated && !isPublicRoute) {
    return Response.redirect(new URL(ROOT, nextUrl))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
