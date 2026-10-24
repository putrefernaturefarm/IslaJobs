"use client"

import { useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserClient } from '@/lib/supabase/client'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 1,
          },
        },
      })
  )

  // Sync the applied theme with the signed-in user's saved preference
  // (covers first load on a new device; same-device loads are instant
  // via the blocking bootstrap script in app/layout.tsx).
  useEffect(() => {
    const supabase = createBrowserClient()
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const applyAuto = () => {
      document.documentElement.setAttribute('data-theme', media.matches ? 'dark' : 'light')
    }

    let cleanupAuto: (() => void) | undefined

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return

      // theme_preference is a newer column — fall back to dark_mode if it
      // doesn't exist in this database yet so the toggle keeps working.
      const { data: profile, error } = await supabase
        .from('users')
        .select('theme_preference, dark_mode')
        .eq('id', user.id)
        .single()

      if (!profile) return
      const row = profile as any

      const preference: 'auto' | 'light' | 'dark' = error
        ? (row.dark_mode ? 'dark' : 'light')
        : (row.theme_preference ?? (row.dark_mode ? 'dark' : 'light'))

      try {
        localStorage.setItem('isla-theme', preference)
      } catch {
        // storage unavailable — theme still applied for this session
      }

      if (preference === 'auto') {
        applyAuto()
        media.addEventListener('change', applyAuto)
        cleanupAuto = () => media.removeEventListener('change', applyAuto)
      } else {
        document.documentElement.setAttribute('data-theme', preference)
      }
    })

    return () => cleanupAuto?.()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
