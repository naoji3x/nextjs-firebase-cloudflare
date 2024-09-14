'use client'

import { getAuth, helloWorldKebab } from '#features/firebase/api/functions'
import ModeSelector from '@/components/elements/mode-selector'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { MessagingContextType } from '@/providers/messaging-provider'
import { useEffect, useState } from 'react'
import { Auth } from 'shared/types/auth'

const SettingsTab = ({ messaging }: { messaging: MessagingContextType }) => {
  const [serverAuth, setServerAuth] = useState<Auth | null>(null)

  // get server auth data
  useEffect(() => {
    const func = async () => {
      console.log('calling getAuth')
      const response = await helloWorldKebab()
      console.log('response', response)
      setServerAuth(await getAuth())
    }
    func()
  }, [])

  return (
    <section className="container mx-auto px-4 py-8">
      <div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="Server Auth">
            <AccordionTrigger>サーバの認証情報</AccordionTrigger>
            <AccordionContent>
              {serverAuth ? (
                <>
                  <div>uid: {serverAuth.uid}</div>
                  <div>name: {serverAuth.token.name}</div>
                  <div>email: {serverAuth.token.email}</div>
                </>
              ) : (
                'no auth data'
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="Token">
            <AccordionTrigger>メッセージのトークン</AccordionTrigger>
            <AccordionContent>
              {messaging ? <div>{messaging.token}</div> : 'no messaging data'}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="flex py-4 items-center">
          <ModeSelector className="pr-2" />
          ：モード設定
        </div>
      </div>
    </section>
  )
}

export default SettingsTab
