'use client'

import { listDeviceTokens } from '#features/firebase/api/device-token'
import { sendMessage } from '#features/firebase/api/functions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/providers/auth-provider'
import { MessagingContextType } from '@/providers/messaging-provider'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const MessageTab = ({ messaging }: { messaging: MessagingContextType }) => {
  const router = useRouter()
  const user = useAuth()
  const [messageValue, setMessageValue] = useState('')

  // handler for sending message
  const handleSendMessage = async () => {
    if (!messaging?.token || messageValue === '') return
    try {
      console.log('sending message : ' + messaging.token)
      if (user) {
        const tokens = (await listDeviceTokens(user.uid)).map((t) => t.id)
        console.log(
          `sending message [${tokens.length}] ... ` + JSON.stringify(tokens)
        )
        await sendMessage('メッセージ', messageValue, tokens)
      }
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  return (
    <section className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        firebase cloud messagingのテスト
      </h2>
      <Input
        className="rounded-full"
        placeholder="Message"
        value={messageValue}
        onChange={(e) => setMessageValue(e.target.value)}
      />
      <div className="text-right my-3">
        <Button onClick={handleSendMessage} disabled={!messageValue}>
          メッセージ
        </Button>
      </div>
    </section>
  )
}

export default MessageTab
