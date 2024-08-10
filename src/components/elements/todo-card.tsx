import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale/ja'
import { useState } from 'react'

const TodoCard = ({
  id = '',
  className = '',
  title = '',
  instruction = 'instruction',
  scheduledAt = new Date(),
  imageUrl = '',
  done = false,
  onDelete = (id: string) => {
    console.log('onDelete', id)
  },
  onDone = (id: string, done: boolean) => {
    console.log('onDone', id, done)
  },
  ...props
}) => {
  const [checked, setChecked] = useState<boolean>(done)
  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    const state: boolean = checked === 'indeterminate' ? false : checked
    setChecked(state)
    onDone(id, state)
  }

  return (
    <Card className={cn('w-full', className)} {...props}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span
            className={cn({
              'opacity-50 pointer-events-none': checked
            })}
          >
            {title ? title : 'Todo'}
          </span>
          <Checkbox
            defaultChecked={done}
            checked={checked}
            onCheckedChange={handleCheckboxChange}
            aria-label="done"
          />
        </CardTitle>
      </CardHeader>
      <CardContent
        className={cn({
          'opacity-50 pointer-events-none': checked
        })}
      >
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <div>{instruction}</div>
              <div className="flex justify-between items-center">
                <Label htmlFor="instruction">予定日時</Label>
                <span>
                  {format(scheduledAt, 'yyyy/MM/dd HH:mm', { locale: ja })}
                </span>
              </div>
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Todo" className="w-full h-auto" />
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          variant="destructive"
          onClick={() => onDelete(id)}
          aria-label="delete"
        >
          削除
        </Button>
      </CardFooter>
    </Card>
  )
}

export default TodoCard
