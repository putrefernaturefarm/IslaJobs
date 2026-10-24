'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  currentDob: string | null
}

export default function EnableWorkerForm({ userId, currentDob }: Props) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [dob, setDob] = useState(currentDob ?? '')
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const maxDate = (() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 18)
    return d.toISOString().split('T')[0]
  })()

  const canSubmit = dob !== '' && confirmed && !loading

  const handleEnable = async () => {
    if (!canSubmit) return

    const birthDate = new Date(dob)
    const cutoff = new Date()
    cutoff.setFullYear(cutoff.getFullYear() - 18)
    if (birthDate > cutoff) {
      setError('You must be at least 18 years old to offer services.')
      return
    }

    setLoading(true)
    setError('')

    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'both', date_of_birth: dob })
      .eq('id', userId)

    if (updateError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setLoading(false)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 -ml-1 text-[#1565D8] active:opacity-70"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Offer Your Services</h1>
      </div>

      <div className="px-4 py-10 flex flex-col items-center gap-6">
        {/* Icon + heading */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-[72px] h-[72px] rounded-full bg-[#E7F0FD] flex items-center justify-center">
            <svg className="w-9 h-9 text-[#1565D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Start earning as a worker</h2>
            <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[280px] leading-snug">
              Keep your same account and login — just add a worker profile alongside your customer profile.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="w-full bg-[var(--color-bg-card)] rounded-2xl px-4 py-5 space-y-5">
          {/* DOB field */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-1.5">
              Date of Birth
            </label>
            <input
              type="date"
              value={dob}
              max={maxDate}
              onChange={(e) => setDob(e.target.value)}
              className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] transition-colors bg-[var(--color-bg-card)]"
            />
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Workers must be at least 18 years old.</p>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                  confirmed ? 'bg-[var(--color-primary)] border-[#1565D8]' : 'bg-[var(--color-bg-card)] border-[var(--color-border)]'
                }`}
              >
                {confirmed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-[var(--color-text-primary)]">I confirm I am at least 18 years old.</span>
          </label>
        </div>

        {error && (
          <div className="w-full bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleEnable}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white font-semibold py-3.5 rounded-full text-sm active:bg-[#166FE5] disabled:opacity-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
          </svg>
          {loading ? 'Enabling…' : 'Enable Worker Profile'}
        </button>

        <p className="text-xs text-[var(--color-text-secondary)] text-center px-4">
          By enabling a worker profile you agree to IslaJobs Terms of Service and commit to providing quality services to clients.
        </p>
      </div>
    </div>
  )
}
