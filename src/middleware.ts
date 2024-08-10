import NextAuth from 'next-auth'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

export const ROOT = '/'
export const PUBLIC_ROUTES = ['/', '/signin']
export const DEFAULT_REDIRECT = '/home'
export default auth((req) => {
  const { nextUrl } = req

  const isAuthenticated = !!req.auth
  console.log(nextUrl.pathname, isAuthenticated)
  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname)

  if (isPublicRoute && isAuthenticated)
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl))

  if (!isAuthenticated && !isPublicRoute)
    return Response.redirect(new URL(ROOT, nextUrl))
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
