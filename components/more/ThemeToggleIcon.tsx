'use client'

import { useState, useTransition } from 'react'
import { Sun, Moon } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  initialDarkMode: boolean
  size?: number
  iconSize?: number
}

export function ThemeToggleIcon({ userId, initialDarkMode, size = 36, iconSize = 17 }: Props) {
  const [isDark, setIsDark] = useState(initialDarkMode)
  const [isPending, startTransition] = useTransition()
  const supabase = createBrowserClient()

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    const theme = next ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('isla-theme', theme)
    } catch {
      // ignore — theme still applied for this session
    }

    startTransition(async () => {
      await supabase.from('users').update({ dark_mode: next }).eq('id', userId)
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-full flex items-center justify-center relative shrink-0"
      style={{
        width: size,
        height: size,
        background: 'var(--color-bg-card)',
        boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
      }}
    >
      {isDark ? (
        <Moon size={iconSize} color="var(--color-primary)" strokeWidth={2} />
      ) : (
        <Sun size={iconSize} color="var(--color-text-primary)" strokeWidth={2} />
      )}
    </button>
  )
}
