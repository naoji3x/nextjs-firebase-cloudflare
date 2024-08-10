'use client'
import { firebaseApp } from '@/features/firebase/client'
import { firebaseEnv } from '@/features/firebase/env.mjs'
import { getMessaging, getToken, isSupported } from 'firebase/messaging'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import { Button } from '../components/ui/button'

export type MessagingContextType =
  | {
      token: string | null
      supported: boolean
    }
  | undefined
const MessagingContext = createContext<MessagingContextType>(undefined)

export const MessagingProvider = ({ children }: { children: ReactNode }) => {
  const [tokenContext, setTokenContext] =
    useState<MessagingContextType>(undefined)
  const [showTokenButton, setShowTokenButton] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)

  useEffect(() => {
    if (!tokenContext) {
      const func = async () => {
        console.log('getting token ...')
        try {
          const supported = await isSupported()
          let token: string | null = null
          if (supported) {
            // https://github.com/firebase/firebase-js-sdk/issues/7693
            navigator.serviceWorker.register('/firebase-messaging-sw.js', {
              scope: '/firebase-cloud-messaging-push-scope'
            })
            console.log('messaging is supported.')
            const messaging = getMessaging(firebaseApp)
            token = await getToken(messaging, {
              vapidKey: firebaseEnv.NEXT_PUBLIC_VAPID_KEY
            })
            console.log('token is successfully obtained.')
            setTokenContext(() => ({
              token,
              supported
            }))
          } else {
            console.log("messaging isn't supported.")
          }
        } catch (error) {
          console.log(error)
          setShowTokenButton(true)
        }
      }
      func()
    }
  }, [tokenContext])

  // トークンを再取得する
  const onClickTokenButton = async () => {
    console.log('retry getting token')
    setDisabled(true)
    const messaging = getMessaging(firebaseApp)
    const token = await getToken(messaging, {
      vapidKey: firebaseEnv.NEXT_PUBLIC_VAPID_KEY
    })
    setTokenContext({ token, supported: true })
  }

  return (
    <MessagingContext.Provider value={tokenContext}>
      {tokenContext ? (
        children
      ) : (
        <div
          className="h-screen w-screen flex justify-center items-center flex-col space-y-10"
          aria-label="読み込み中"
        >
          <div className="mx-5 text-center">
            <p>通知の許可が求められた場合は、</p>
            <p>「許可」を選択して下さい。</p>
            <p>何回か求められる場合があります。</p>
          </div>
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          {showTokenButton && (
            <Button onClick={onClickTokenButton} disabled={disabled}>
              通知を許可する
            </Button>
          )}
        </div>
      )}
    </MessagingContext.Provider>
  )
}

export const useMessaging = (): MessagingContextType =>
  useContext(MessagingContext)
