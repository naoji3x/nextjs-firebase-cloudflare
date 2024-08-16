import { Auth } from 'shared/types/auth'

// Functionに渡された認証情報を取得する関数
export const getAuth = (auth?: Auth): Auth | null =>
  auth
    ? {
        uid: auth.uid,
        token: {
          name: auth.token.name,
          email: auth.token.email
        }
      }
    : null
