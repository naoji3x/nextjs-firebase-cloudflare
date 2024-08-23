import { HttpsError } from 'firebase-functions/v2/https'
import { Auth } from 'shared/types/auth'

// Functionに渡された認証情報を取得する関数
export const getAuth = (auth?: Auth): Auth => {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'auth is undefined')
  }
  return {
    uid: auth.uid,
    token: {
      name: auth.token.name,
      email: auth.token.email
    }
  }
}
