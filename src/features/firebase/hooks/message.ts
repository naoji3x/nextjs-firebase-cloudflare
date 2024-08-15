import { onMessageReceived } from '@/features/firebase/api/message'
import { ReceivedMessage } from '@/types/message'
import { useEffect, useState } from 'react'

export const useMessage = () => {
  const [message, setMessage] = useState<ReceivedMessage | null>(null)
  useEffect(() => onMessageReceived((message) => setMessage(message)), [])
  return { message }
}
