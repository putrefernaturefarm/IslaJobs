'use client'
import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightElement?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightElement, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="w-full">
        {label && (
          <label className="form-label">{label}</label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-4 text-[#6B6560] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            type={inputType}
            className={cn(
              'input-field',
              leftIcon && 'pl-10',
              (isPassword || rightElement) && 'pr-12',
              error && 'border-[#E11D48]',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-4 text-[#6B6560]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          {!isPassword && rightElement && (
            <span className="absolute right-4">{rightElement}</span>
          )}
        </div>
        {error && <p className="error-text">{error}</p>}
        {hint && !error && <p className="text-[12px] text-[#6B6560] mt-1">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
