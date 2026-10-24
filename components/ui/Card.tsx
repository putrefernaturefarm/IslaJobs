import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean
}

function Card({ className, noPadding, children, ...props }: CardProps) {
  return (
    <div
      className={cn('card', noPadding && '!p-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Card }
