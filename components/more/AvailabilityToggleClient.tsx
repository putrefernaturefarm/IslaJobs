'use client'

import { useState, useTransition } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  initialValue: boolean
}

export default function AvailabilityToggleClient({ userId, initialValue }: Props) {
  const [isAvailable, setIsAvailable] = useState(initialValue)
  const [isPending, startTransition] = useTransition()
  const supabase = createBrowserClient()

  const handleToggle = () => {
    const next = !isAvailable
    setIsAvailable(next)

    startTransition(async () => {
      await supabase
        .from('users')
        .update({ is_available: next })
        .eq('id', userId)
    })
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isAvailable ? 'Set unavailable' : 'Set available'}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        isAvailable ? 'bg-[#1565D8]' : 'bg-[#CDD1D6]'
      } ${isPending ? 'opacity-60' : ''}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          isAvailable ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
