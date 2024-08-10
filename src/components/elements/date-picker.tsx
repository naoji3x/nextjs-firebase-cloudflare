import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

const DatePicker = ({
  date,
  onSelect
}: {
  date: Date
  onSelect: (date?: Date) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (date?: Date) => {
    onSelect(date)
    setIsOpen(false)
  }

  return (
    <>
      <Popover
        defaultOpen={false}
        open={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
      >
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'w-[240px] pl-3 text-center font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <span className="mx-auto">
              {date ? format(date, 'PPP', { locale: ja }) : 'Pick a date'}
            </span>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            locale={ja}
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  )
}

export default DatePicker
