import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'
import { Speech } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const SpeechToast = ({ message = 'toast message' }) => {
  const [speaking, setSpeaking] = useState<boolean>(false)

  const speak = (speech: string | null) => {
    if (speech && !speaking) {
      const ssu = new SpeechSynthesisUtterance(speech)
      ssu.onstart = () => {
        setSpeaking(true)
      }
      const stop = () => {
        setSpeaking(false)
      }

      ssu.onend = stop
      ssu.onerror = stop
      ssu.onpause = stop
      speechSynthesis.speak(ssu)
    }
  }

  const buttonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    buttonRef.current?.focus()
  })
  return (
    <ToastAction altText="話す" asChild>
      <Button
        ref={buttonRef}
        className="rounded-full bg-primary"
        onClick={() => speak(message || null)}
      >
        <Speech size={24} />
      </Button>
    </ToastAction>
  )
}

type ToastMessage = {
  title?: string
  description: string
}
export const useSpeechToast = () => {
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null)

  // Toastを表示
  useEffect(() => {
    if (toastMessage === null) return
    toast({
      variant: 'default',
      title: toastMessage?.title,
      description: toastMessage?.description,
      duration: 1000 * 60 * 60,
      onOpenChange: (open) => {
        if (!open) {
          setToastMessage(null)
        }
      },
      action: <SpeechToast message={toastMessage.description} />
    })
  }, [toastMessage])

  return { setToastMessage }
}
