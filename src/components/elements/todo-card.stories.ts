import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from '@storybook/test'
import TodoCard from './todo-card'

const meta = {
  title: 'components/elements/TodoCard',
  component: TodoCard,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof TodoCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: '1',
    title: '日課',
    instruction: '朝起きたら顔を洗う。',
    scheduledAt: new Date('2024-02-01T00:00:00Z'),
    imageUrl: 'https://picsum.photos/300'
  }
}

export const Done: Story = {
  args: {
    id: '1',
    onDone: fn()
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    const doneCheckbox = canvas.getByRole('checkbox', { name: /done/i })
    await userEvent.click(doneCheckbox)
    await waitFor(() => expect(args.onDone).toHaveBeenCalledWith('1', true))
  }
}

export const Deleted: Story = {
  args: {
    id: '1',
    onDelete: fn()
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const deleteButton = canvas.getByRole('button', { name: /delete/i })
    await userEvent.click(deleteButton)
    await waitFor(() => expect(args.onDelete).toHaveBeenCalledWith('1'))
  }
}
