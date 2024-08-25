import type { Meta, StoryObj } from '@storybook/react'
import Index from './page'

const meta = {
  title: 'app/Index',
  component: Index,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Index>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
