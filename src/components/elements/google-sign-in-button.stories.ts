import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from '@storybook/test'
import GoogleSignInButton from './google-sign-in-button'

const meta = {
  title: 'components/elements/GoogleSignInButton',
  component: GoogleSignInButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof GoogleSignInButton>

export default meta
type Story = StoryObj<typeof meta>

export const Enabled: Story = {}

export const DestructiveIcon: Story = {
  args: {
    variant: 'destructive',
    size: 'icon'
  }
}
export const Disabled: Story = {
  args: {
    disabled: true
  }
}

export const Clicked: Story = {
  args: {
    onClick: fn()
  },

  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await userEvent.click(button)
    await waitFor(() => expect(args.onClick).toHaveBeenCalled())
  }
}
