import { SessionProvider } from '@/providers/session-provider'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover'
}

export const metadata: Metadata = {
  title: 'Todo App',
  description: 'Save and Get Reminders for Your Todos!'
}

const RootLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <SessionProvider>
      <html lang="en">
        <head />
        <body className={inter.className}>{children}</body>
      </html>
    </SessionProvider>
  )
}

export default RootLayout
