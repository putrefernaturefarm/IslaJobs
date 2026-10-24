import { cn } from '@/lib/utils'

type BadgeVariant = 'primary' | 'success' | 'error' | 'warning' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  className?: string
  children: React.ReactNode
}

const variantMap: Record<BadgeVariant, string> = {
  primary: 'badge-primary',
  success: 'badge-success',
  error: 'badge-error',
  warning: 'badge-warning',
  neutral: 'badge-neutral',
}

function Badge({ variant = 'primary', className, children }: BadgeProps) {
  return (
    <span className={cn(variantMap[variant], 'rounded-full px-3 py-0.5', className)}>
      {children}
    </span>
  )
}

export { Badge }
