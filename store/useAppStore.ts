'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/database'

interface AppState {
  user: User | null
  darkMode: boolean
  setUser: (user: User | null) => void
  setDarkMode: (dark: boolean) => void
  clearUser: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      darkMode: false,
      setUser: (user) => set({ user }),
      setDarkMode: (darkMode) => set({ darkMode }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'islajobs-store',
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
)
