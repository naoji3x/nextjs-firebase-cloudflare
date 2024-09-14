import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ListTodo, Settings, Users } from 'lucide-react'
import { useState } from 'react'

const TabBar = ({
  defaultValue = 'todo',
  onValueChange = (value: string) => {},
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue)

  const Item = ({
    value,
    title,
    children
  }: {
    value: string
    title: string
    children: React.ReactNode
  }) => (
    <ToggleGroupItem value={value} className="p-2 h-14 w-1/4">
      {children}
      <span className="text-[11px] xs:text-xs">{title}</span>
    </ToggleGroupItem>
  )

  return (
    <div className=" w-screen flex justify-center max-w-7xl">
      <div className="flex flex-row w-full max-w-4xl px-1">
        <ToggleGroup
          className="w-full"
          type="single"
          defaultValue={defaultValue}
          value={selectedValue}
          variant="default"
          onValueChange={(value) => {
            if (value) {
              setSelectedValue(value)
              onValueChange(value)
            }
          }}
        >
          <Item value="todo" title="やること">
            <ListTodo size={24} />
          </Item>
          <Item value="message" title="メッセージ">
            <Users size={24} />
          </Item>
          <Item value="settings" title="設定">
            <Settings size={24} />
          </Item>
        </ToggleGroup>
      </div>
    </div>
  )
}

export default TabBar
