'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import type { Service } from '@/types/database'

interface Props {
  workerId: string
  workerName: string
  customerId: string
  services: Service[]
}

export default function HireWorkerForm({ workerId, workerName, customerId, services }: Props) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [serviceId, setServiceId] = useState(services[0]?.id ?? '')
  const selectedService = services.find((s) => s.id === serviceId) ?? null

  const [price, setPrice] = useState(selectedService ? String(selectedService.price) : '')
  const [address, setAddress] = useState('')
  const [details, setDetails] = useState('')
  const [date, setDate] = useState('')
  const [hours, setHours] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleServiceChange = (id: string) => {
    setServiceId(id)
    const service = services.find((s) => s.id === id)
    if (service) setPrice(String(service.price))
  }

  const pricingType = selectedService?.pricing_type ?? 'fixed'
  const priceNum = Number(price) || 0
  const hoursNum = Number(hours) || 0
  const estimatedTotal = pricingType === 'hourly' ? priceNum * hoursNum : priceNum

  const canSubmit = priceNum > 0 && address.trim() && details.trim() && date

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('Fill in the price, address, job details, and date before confirming.')
      return
    }

    setSaving(true)
    setError('')

    const { data: jobPost, error: jobError } = await supabase
      .from('job_posts')
      .insert({
        customer_id: customerId,
        title: selectedService?.title ?? `Direct booking with ${workerName}`,
        description: details.trim(),
        address: address.trim(),
        category_slug: 'other',
        pricing_type: pricingType,
        budget_max: priceNum,
        workers_needed: 1,
        scheduled_date: date,
        estimated_hours: hoursNum || null,
        status: 'in_progress',
      })
      .select('id')
      .single()

    if (jobError || !jobPost) {
      setSaving(false)
      setError('Failed to create the booking. Please try again.')
      return
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        job_post_id: jobPost.id,
        worker_id: workerId,
        customer_id: customerId,
        status: 'pending',
      })
      .select('id')
      .single()

    setSaving(false)

    if (bookingError || !booking) {
      setError('Booking details were saved, but the booking itself failed. Please try again.')
      return
    }

    router.push(`/bookings/${booking.id}`)
  }

  return (
    <div className="flex flex-col gap-4">
      {services.length > 0 && (
        <div>
          <label className="form-label">Choose a service</label>
          <select
            value={serviceId}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="input-field"
          >
            <option value="">Custom / negotiable job</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} — ₱{s.price.toLocaleString()} {s.pricing_type === 'hourly' ? '/hr' : 'fixed'}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="form-label">
          {pricingType === 'hourly' ? 'Rate per hour (PHP)' : 'Fixed Price (PHP)'}
        </label>
        <p className="text-[13px] text-text-secondary mb-2 -mt-1">
          {selectedService
            ? 'Set by the selected service. You can adjust it if you agree on a different amount.'
            : 'Set the price you and the worker agree on.'}
        </p>
        <input
          type="number"
          min={1}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 500"
          className="input-field"
        />
      </div>

      <div>
        <label className="form-label">Job Address / Landmark</label>
        <p className="text-[13px] text-text-secondary mb-2 -mt-1">
          Include barangay, street, and a nearby landmark so the worker can find you easily.
        </p>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={2}
          placeholder="e.g. Brgy. Don Ruben, near covered court, blue gate."
          className="input-field resize-none"
        />
      </div>

      <div>
        <label className="form-label">Job Details / Instructions</label>
        <p className="text-[13px] text-text-secondary mb-2 -mt-1">
          Describe the task in detail so the worker knows exactly what to do.
        </p>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={4}
          placeholder="Example: Need house cleaning for a 2BR apartment, include mopping, bathroom cleaning, and changing bedsheets."
          className="input-field resize-none"
        />
      </div>

      <div>
        <label className="form-label">When do you need this?</label>
        <p className="text-[13px] text-text-secondary mb-2 -mt-1">Pick the job date.</p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input-field"
        />
      </div>

      <div>
        <label className="form-label">Estimated Hours (optional)</label>
        <input
          type="number"
          min={0}
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="e.g. 4"
          className="input-field"
        />
      </div>

      {priceNum > 0 && (
        <div className="rounded-xl px-4 py-3" style={{ background: 'var(--color-success-light)' }}>
          <p className="text-[13px] font-semibold text-success">
            Estimated total: ₱{estimatedTotal.toLocaleString()}
            {pricingType === 'hourly' && hoursNum > 0 ? ` (₱${priceNum}/hr × ${hoursNum}h)` : pricingType === 'fixed' ? ' (fixed price)' : ''}
          </p>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || saving}
        className="w-full bg-primary text-white font-semibold py-3.5 rounded-full text-sm active:opacity-90 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Confirming…' : 'Confirm Booking'}
      </button>
      <p className="text-[12px] text-text-tertiary text-center">
        IslaJobs does not process payment in-app. You and {workerName} arrange payment directly when the job is done.
      </p>
    </div>
  )
}
