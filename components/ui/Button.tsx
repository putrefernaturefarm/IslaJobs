'use client'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  loading?: boolean
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', loading, fullWidth = true, children, disabled, ...props }, ref) => {
    const base = 'h-[52px] flex items-center justify-center gap-2 font-semibold text-[16px] rounded-full transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed'
    const width = fullWidth ? 'w-full' : 'px-6'

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-[#1565D8] text-white hover:bg-[#0E4DAE] active:bg-[#0C3F8F]',
      secondary: 'bg-white text-[#1A1A1A] border border-[1.5px] border-[#E4E0D8] hover:bg-[#F5F4F1]',
      ghost: 'bg-transparent border-none text-[#1565D8] text-[15px] font-medium h-auto rounded-none',
      danger: 'bg-[#FFF1F2] text-[#E11D48] border-none',
    }

    return (
      <button
        ref={ref}
        className={cn(base, width, variants[variant], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
