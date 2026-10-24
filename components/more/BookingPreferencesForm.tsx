'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'

interface Props {
  userId: string
  initialRadiusKm: number
  initialMaxActiveJobs: number
}

export default function BookingPreferencesForm({ userId, initialRadiusKm, initialMaxActiveJobs }: Props) {
  const supabase = createBrowserClient()

  const [radiusKm, setRadiusKm] = useState(String(initialRadiusKm))
  const [maxActiveJobs, setMaxActiveJobs] = useState(String(initialMaxActiveJobs))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess(false)

    const { error: updateError } = await supabase
      .from('users')
      .update({
        service_radius_km: Number(radiusKm) || 0,
        max_active_jobs: Number(maxActiveJobs) || 0,
      })
      .eq('id', userId)

    setSaving(false)

    if (updateError) {
      setError(
        updateError.message?.includes('column')
          ? 'Service radius and max active jobs are not yet supported by the database. Ask your developer to add those columns.'
          : 'Failed to save settings. Please try again.'
      )
      return
    }

    setSuccess(true)
  }

  return (
    <>
      <Card>
        <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-4">
          Job Preferences
        </p>

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-1.5">
              Service Radius (km)
            </label>
            <p className="text-[13px] text-text-secondary mb-2.5">
              We&apos;ll match you with customers inside this radius.
            </p>
            <input
              type="number"
              min={1}
              max={200}
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-[15px] text-text-primary bg-bg-card outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-1.5">
              Max Active Jobs
            </label>
            <p className="text-[13px] text-text-secondary mb-2.5">
              Set a limit so you do not get overloaded with ongoing bookings.
            </p>
            <input
              type="number"
              min={1}
              max={20}
              value={maxActiveJobs}
              onChange={(e) => setMaxActiveJobs(e.target.value)}
              className="w-full border border-border rounded-xl px-4 py-3 text-[15px] text-text-primary bg-bg-card outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </Card>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="text-[13px] text-success text-center">Settings saved.</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-primary text-white font-semibold py-3.5 rounded-full text-sm active:opacity-90 disabled:opacity-60 transition-colors"
      >
        {saving ? 'Saving…' : 'Save settings'}
      </button>
    </>
  )
}
