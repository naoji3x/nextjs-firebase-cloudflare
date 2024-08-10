import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface Props {
  date: Date
  onValueChange: (date: Date) => void
}

const TimePicker = ({ date, onValueChange }: Props) => {
  const onHourChange = (hour: string) => {
    date.setHours(parseInt(hour))
    onValueChange(date)
  }

  const onMinuteChange = (minute: string) => {
    date.setMinutes(parseInt(minute))
    onValueChange(date)
  }

  return (
    <div className="flex items-center space-x-2">
      <Select
        defaultValue={date.getHours().toString()}
        onValueChange={onHourChange}
      >
        <SelectTrigger className="w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {[...Array(24)].map((_, hour) => {
            return (
              <SelectItem key={hour} value={hour.toString()}>
                {('0' + hour).slice(-2)}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      <div>時</div>
      <Select
        defaultValue={date.getMinutes().toString()}
        onValueChange={onMinuteChange}
      >
        <SelectTrigger className="w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {[...Array(60)].map((_, hour) => {
            return (
              <SelectItem key={hour} value={hour.toString()}>
                {('0' + hour).slice(-2)}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
      <div>分</div>
    </div>
  )
}

export default TimePicker
