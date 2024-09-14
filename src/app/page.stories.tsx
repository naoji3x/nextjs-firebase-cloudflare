import type { Meta, StoryObj } from '@storybook/react'
import { SessionProvider } from 'next-auth/react'
import Index from './page'

const meta = {
  title: 'app/Index',
  component: Index,
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true
    }
  },
  tags: ['autodocs']
} satisfies Meta<typeof Index>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [
    (Story) => (
      <SessionProvider session={null}>
        <Story />
      </SessionProvider>
    )
  ]
}
