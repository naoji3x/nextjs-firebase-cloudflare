import { onMessageReceived } from '@/features/firebase/api/message'
import { useEffect, useState } from 'react'
import { ReceivedMessage } from 'shared/types/message'

export const useMessage = () => {
  const [message, setMessage] = useState<ReceivedMessage | null>(null)
  useEffect(() => onMessageReceived((message) => setMessage(message)), [])
  return { message }
}
