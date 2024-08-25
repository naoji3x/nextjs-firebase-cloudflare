import { SessionProvider } from '@/providers/session-provider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  manifest: '/manifest.json',
  title: 'Todo App',
  description: 'Save and Get Reminders for Your Todos!',
  viewport:
    'width=device-width, initial-scale=1, maximum-scale=1 viewport-fit=cover'
}

const RootLayout = ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </SessionProvider>
  )
}

export default RootLayout
