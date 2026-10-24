'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TopBarProps {
  title: string
  onBack?: () => void
  rightElement?: React.ReactNode
  className?: string
  transparent?: boolean
}

export function TopBar({ title, onBack, rightElement, className, transparent }: TopBarProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 flex items-center h-14',
        transparent ? 'bg-transparent' : 'bg-bg-card',
        !transparent && 'border-b border-border',
        className
      )}
    >
      <button
        onClick={handleBack}
        className="flex items-center justify-center w-10 h-10 ml-2 text-text-primary rounded-full hover:bg-bg-sunken active:opacity-70 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={22} />
      </button>
      <h1 className="flex-1 text-center text-[17px] font-semibold text-text-primary pr-12">
        {title}
      </h1>
      {rightElement && (
        <div className="absolute right-4">{rightElement}</div>
      )}
    </header>
  )
}
