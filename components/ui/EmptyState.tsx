import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateAction {
  label: string
  href: string
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  primaryAction?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  tone?: 'primary' | 'accent' | 'success'
}

const TONES = {
  primary: { bg: 'var(--color-primary-light)', fg: 'var(--color-primary)' },
  accent: { bg: 'var(--color-accent-light)', fg: 'var(--color-accent)' },
  success: { bg: 'var(--color-success-light)', fg: '#16A34A' },
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  tone = 'primary',
}: EmptyStateProps) {
  const colors = TONES[tone]

  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      <div className="relative w-20 h-20 mb-5 shrink-0">
        <span className="absolute inset-0 rounded-full" style={{ background: colors.bg }} />
        <span className="absolute -top-1 -right-2 w-5 h-5 rounded-full" style={{ background: colors.bg, opacity: 0.7 }} />
        <span className="absolute -bottom-1 -left-2 w-4 h-4 rounded-full" style={{ background: colors.bg, opacity: 0.5 }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <Icon size={26} color={colors.fg} strokeWidth={1.8} />
          </div>
        </div>
      </div>

      <p className="text-[16px] font-bold text-text-primary">{title}</p>
      <p className="text-[13px] text-text-secondary mt-1 max-w-[260px]">{description}</p>

      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-2.5 mt-5">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="h-10 px-5 rounded-full flex items-center justify-center text-[13px] font-semibold text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              {primaryAction.label}
            </Link>
          )}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="h-10 px-5 rounded-full flex items-center justify-center text-[13px] font-semibold"
              style={{ background: 'var(--color-bg-sunken)', color: 'var(--color-text-primary)' }}
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
