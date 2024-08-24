import type { Meta, StoryObj } from '@storybook/react'
import Home from './page'

const meta = {
  title: 'app/home/Home',
  component: Home,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof Home>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/*
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
*/
