import { fn } from '@storybook/test'
// import { signIn as actualSignIn } from './auth'

export const signIn = fn() //fn(actualSignIn).mockName('signIn')
export const signOut = fn() // fn(actual.signOut).mockName('signOut')
export const auth = fn() // fn(actual.auth).mockName('auth')
