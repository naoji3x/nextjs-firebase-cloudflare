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
    <ToggleGroupItem
      value={value}
      className="p-2 h-14 w-1/3 flex flex-col items-center"
    >
      <div>{children}</div>
      <div className="text-[11px] xs:text-xs">{title}</div>
    </ToggleGroupItem>
  )

  return (
    <div className="w-full flex justify-between bg-background border">
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
  )
}

export default TabBar
