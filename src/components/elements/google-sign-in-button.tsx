'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export const GoogleSignInButton: React.FC<ButtonProps> = ({
  className = '',
  children = 'Googleでログイン',
  ...props
}) => {
  const { size } = props
  return (
    <Button
      className={cn(
        size !== 'icon' ? 'px-4 py-2' : '',
        'border flex gap-2 border-slate-200 rounded-lg transition-color duration-200 active:border-slate-500 hover:shadow-md',
        className
      )}
      {...props}
    >
      <Image
        width={24}
        height={24}
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
      />
      {size !== 'icon' ? children : null}
    </Button>
  )
}

export default GoogleSignInButton
