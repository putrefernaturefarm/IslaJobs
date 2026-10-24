'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarCheck } from 'lucide-react'

interface Props {
  workerId: string
  workerName: string
}

export function HireConfirmDialog({ workerId, workerName }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 h-[48px] rounded-full font-semibold text-[14px] text-white bg-primary active:opacity-90"
      >
        <CalendarCheck size={16} strokeWidth={2.2} />
        Hire
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-[430px] rounded-t-[28px] px-5 pt-6 pb-8"
            style={{ background: 'var(--color-bg-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4"
              style={{ background: 'var(--color-success-light)' }}
            >
              <CalendarCheck size={22} color="#16A34A" strokeWidth={1.8} />
            </div>
            <h2 className="text-[17px] font-bold text-text-primary mb-1.5">Hire this worker?</h2>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
              You&apos;ll be taken to the booking screen for {workerName}. Set schedule, price, and job
              details there.
            </p>
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-3.5 rounded-full text-[14px] font-semibold text-text-secondary"
                style={{ background: 'var(--color-bg-sunken)' }}
              >
                Not now
              </button>
              <button
                type="button"
                onClick={() => router.push(`/bookings/new/${workerId}`)}
                className="flex-1 py-3.5 rounded-full text-[14px] font-semibold text-white bg-primary"
              >
                Go to booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
