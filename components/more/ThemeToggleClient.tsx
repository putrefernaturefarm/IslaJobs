'use client'

import { useState, useTransition } from 'react'
import { Smartphone, Sun, Moon } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

type ThemePreference = 'auto' | 'light' | 'dark'

interface Props {
  userId: string
  initialPreference: ThemePreference
}

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: 'auto', label: 'Auto', Icon: Smartphone },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
]

export default function ThemeToggleClient({ userId, initialPreference }: Props) {
  const [preference, setPreference] = useState<ThemePreference>(initialPreference)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const supabase = createBrowserClient()

  const applyTheme = (pref: ThemePreference) => {
    setPreference(pref)
    setError('')

    const resolved =
      pref === 'auto'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : pref
    document.documentElement.setAttribute('data-theme', resolved)
    try {
      localStorage.setItem('isla-theme', pref)
    } catch {
      // ignore — theme still applied for this session
    }

    startTransition(async () => {
      const { error: updateError } = await supabase
        .from('users')
        .update({ theme_preference: pref, dark_mode: pref === 'dark' })
        .eq('id', userId)

      if (updateError?.message?.includes('column')) {
        setError('This device will remember your choice, but it won’t sync to your other devices yet.')
      }
    })
  }

  return (
    <div className="card !rounded-[20px]">
      <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-4">
        Display
      </p>
      <div className="flex gap-2.5">
        {OPTIONS.map(({ value, label, Icon }) => {
          const active = preference === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => applyTheme(value)}
              disabled={isPending}
              className="flex-1 flex flex-col items-center gap-2 py-5 rounded-[16px] transition-colors"
              style={{
                background: active ? 'var(--color-primary-xlight)' : 'var(--color-bg-sunken)',
              }}
            >
              <Icon
                size={22}
                color={active ? 'var(--color-primary)' : 'var(--color-text-secondary)'}
                strokeWidth={1.8}
              />
              <span
                className="text-[13px] font-semibold"
                style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
      {error && <p className="text-[12px] text-text-tertiary mt-3">{error}</p>}
    </div>
  )
}
