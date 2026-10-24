'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('isla-theme')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(stored === 'dark' || (!stored && systemDark))
  }, [])

  const toggle = () => {
    const next = !isDark
    setIsDark(next)
    const theme = next ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('isla-theme', theme) } catch { /* ignore */ }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-9 h-9 rounded-full flex items-center justify-center"
      style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)' }}
    >
      {isDark ? (
        <Moon size={17} color="#fff" strokeWidth={2} />
      ) : (
        <Sun size={17} color="#fff" strokeWidth={2} />
      )}
    </button>
  )
}
