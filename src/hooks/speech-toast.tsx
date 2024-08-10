import { Button } from '@/components/ui/button'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'
import { Speech } from 'lucide-react'
import { useEffect, useState } from 'react'

type ToastMessage = {
  title?: string
  description: string
}
export const useSpeechToast = () => {
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null)
  const [speaking, setSpeaking] = useState<boolean>(false)
  const [speech, setSpeech] = useState<string | null>(null)

  // Toastを表示
  useEffect(() => {
    if (toastMessage === null) return

    const speak = (speech: string | null) => {
      if (speech && !speaking) {
        setToastMessage(null)
        setSpeaking(() => true)
        const ssu = new SpeechSynthesisUtterance(speech)
        ssu.onstart = () => {
          setSpeech(speech)
        }
        const stop = () => {
          setSpeech(null)
          setSpeaking(() => false)
        }

        ssu.onend = stop
        ssu.onerror = stop
        ssu.onpause = stop
        speechSynthesis.speak(ssu)
      }
    }

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
      action: (
        <ToastAction altText="話す" asChild>
          <Button
            className="rounded-full bg-primary"
            onClick={() => speak(toastMessage?.description || null)}
          >
            <Speech size={24} />
          </Button>
        </ToastAction>
      )
    })
  }, [toastMessage, speaking])

  return { speech, setToastMessage }
}
