'use client'

import { useState, useTransition } from 'react'
import { Heart } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

interface Props {
  customerId: string
  workerId: string
  initialSaved: boolean
  size?: number
}

export function SaveWorkerButton({ customerId, workerId, initialSaved, size = 18 }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [isPending, startTransition] = useTransition()
  const supabase = createBrowserClient()

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const next = !saved
    setSaved(next)

    startTransition(async () => {
      if (next) {
        await supabase.from('saved_workers').insert({ customer_id: customerId, worker_id: workerId })
      } else {
        await supabase
          .from('saved_workers')
          .delete()
          .eq('customer_id', customerId)
          .eq('worker_id', workerId)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      aria-label={saved ? 'Remove from saved workers' : 'Save worker'}
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
      style={{ background: saved ? '#FFF1F2' : 'var(--color-bg-sunken)' }}
    >
      <Heart
        size={size}
        color={saved ? '#E11D48' : 'var(--color-text-secondary)'}
        fill={saved ? '#E11D48' : 'none'}
        strokeWidth={2}
      />
    </button>
  )
}
