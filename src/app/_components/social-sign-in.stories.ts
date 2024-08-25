import type { Meta, StoryObj } from '@storybook/react'
import SocialSignIn from './social-sign-in'

const meta = {
  title: 'app/_components/SocialSignIn',
  component: SocialSignIn,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof SocialSignIn>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
