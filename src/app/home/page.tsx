'use client'

import { upsertDeviceToken } from '#features/firebase/api/device-token'
import { Button } from '@/components/ui/button'
import { Tabs } from '@/components/ui/tabs'
import { env } from '@/env.mjs'
import useFooterVisible from '@/hooks/footer-visible'
import { useMessage } from '@/hooks/message'
import { useSpeechToast } from '@/hooks/speech-toast'
import { cn } from '@/lib/utils'
import { useAuth } from '@/providers/auth-provider'
import { useMessaging } from '@/providers/messaging-provider'
import { TabsContent } from '@radix-ui/react-tabs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import MessageTab from './_components/message-tab'
import SettingsTab from './_components/settings-tab'
import TabBar from './_components/tab-bar'
import TodoTab from './_components/todo-tab'

const Home = () => {
  const router = useRouter()
  const { isFooterVisible } = useFooterVisible()
  const searchParams = useSearchParams()
  const [selectedTab, setSelectedTab] = useState(
    searchParams?.get('tab') || 'todo'
  )
  const messaging = useMessaging()
  const user = useAuth()
  const { message } = useMessage()
  const { setToastMessage } = useSpeechToast()

  // register fcm token
  useEffect(() => {
    if (!messaging || messaging.token === null || !user) return
    const token: string = messaging.token
    const func = async () => {
      console.log('requesting permission')
      await upsertDeviceToken(user.uid, token)
      console.log('getting token')
    }
    func()
  }, [messaging, user])

  // show toast message
  useEffect(() => {
    if (!message) return
    console.log('message: ', message)
    setToastMessage({
      title: message?.notification?.title,
      description: message?.notification?.body || ''
    })
  }, [message, setToastMessage])

  // tab change handler
  const onValueChange = (value: string) => {
    setSelectedTab(value)
    router.push('?tab=' + value)
  }

  // block browser back
  useEffect(() => {
    const blockBrowserBack = () => window.history.go(1)
    window.history.pushState(null, '', window.location.href) // 直前の履歴に現在のページを追加
    window.addEventListener('popstate', blockBrowserBack) // 直前の履歴と現在のページのループ
    return () => {
      window.removeEventListener('popstate', blockBrowserBack)
    }
  }, [])

  return (
    <div className="min-h-screen min-w-screen">
      <header className="w-full py-4 bg-foreground text-background">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <div className="text-xl font-bold">
              {user ? user.name : 'No user'}
            </div>
            <div className="text-xs">
              nextjs-firebase-cloudflare: ver. {env.NEXT_PUBLIC_VERSION}
            </div>
          </div>
          <Button variant={'secondary'} onClick={() => router.push('/signout')}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="w-full">
        <div className="mx-auto max-w-screen-xl px-0 sm:px-2 pb-10 min-h-screen">
          <Tabs defaultValue="todo" value={selectedTab}>
            <TabsContent value="todo">
              <TodoTab />
            </TabsContent>
            <TabsContent value="message">
              <MessageTab messaging={messaging} />
            </TabsContent>
            <TabsContent value="settings">
              <SettingsTab messaging={messaging} />
            </TabsContent>
          </Tabs>
        </div>
        <div
          className={cn(
            'fixed bottom-0 left-0 right-0 mx-auto w-full max-w-7xl px-2 shadow-md transition-all duration-200 z-50',
            isFooterVisible ? 'translate-y-0' : 'translate-y-16'
          )}
        >
          <div className="relative">
            <div className="flex flex-col items-center pb-safe">
              <div className="h-16 flex flex-col items-center justify-center">
                <TabBar
                  defaultValue={selectedTab}
                  onValueChange={onValueChange}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
