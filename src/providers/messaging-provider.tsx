'use client'

import { getFcmToken, isFcmSupported } from '#features/firebase/api/message'
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
  const [showDisableMessagingButton, setShowDisableMessagingButton] =
    useState<boolean>(false)
  const [skipMessagingCheck, setSkipMessagingCheck] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)

  useEffect(() => {
    if (!tokenContext) {
      const func = async () => {
        console.log('getting token ...')
        const supported = await isFcmSupported()
        if (!supported) {
          console.log("messaging isn't supported.")
          setShowDisableMessagingButton(true)
          return
        }
        setShowTokenButton(true)
      }
      func()
    }
  }, [tokenContext])

  // トークンを取得する
  const onClickTokenButton = async () => {
    console.log('retry getting token')
    setDisabled(true)
    try {
      const token = await getFcmToken()
      setTokenContext({ token, supported: true })
    } catch (error) {
      // トークンが取得できなかった場合
      console.log(error)
      setDisabled(false)
    }
  }

  return (
    <MessagingContext.Provider value={tokenContext}>
      {tokenContext || skipMessagingCheck ? (
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
          {showDisableMessagingButton && (
            <Button onClick={() => setSkipMessagingCheck(true)}>
              メッセージ受信しない
            </Button>
          )}
        </div>
      )}
    </MessagingContext.Provider>
  )
}

export const useMessaging = (): MessagingContextType =>
  useContext(MessagingContext)
