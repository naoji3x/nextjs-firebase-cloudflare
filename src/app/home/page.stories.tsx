import { AuthProvider } from '@/providers/auth-provider'
import { MessagingProvider } from '@/providers/messaging-provider'
import type { Meta, StoryObj } from '@storybook/react'
import { SessionProvider } from 'next-auth/react'
import Home from './page'

const meta = {
  title: 'app/Home',
  component: Home,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Home>

export default meta
type Story = StoryObj<typeof meta>

const session = {
  user: {
    name: 'Dummy User',
    email: 'dummy.user@example.com',
    image: 'https://www.example.com/dummy-user.jpg',
    id_token: 'dummy-id-token'
  },
  expires: '2099-09-24T04:52:06.123Z'
}

export const Default: Story = {
  decorators: [
    (Story) => (
      <SessionProvider session={session}>
        <MessagingProvider>
          <AuthProvider>
            <Story />
          </AuthProvider>
        </MessagingProvider>
      </SessionProvider>
    )
  ]
}
