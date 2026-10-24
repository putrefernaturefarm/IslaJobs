'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import type { PayoutDetail, PayoutMethod } from '@/types/database'

interface Props {
  userId: string
  payout: PayoutDetail | null
}

const METHODS: { value: PayoutMethod; label: string; color: string; description: string }[] = [
  {
    value: 'gcash',
    label: 'GCash',
    color: '#007DFF',
    description: 'Most popular mobile wallet in the Philippines',
  },
  {
    value: 'maya',
    label: 'Maya',
    color: '#00B050',
    description: 'Formerly PayMaya — widely accepted',
  },
]

export default function PayoutForm({ userId, payout }: Props) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [method, setMethod] = useState<PayoutMethod>(payout?.method ?? 'gcash')
  const [accountName, setAccountName] = useState(payout?.account_name ?? '')
  const [accountNumber, setAccountNumber] = useState(payout?.account_number ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    if (!accountName.trim()) { setError('Account name is required.'); return }
    if (!accountNumber.trim()) { setError('Account number / mobile number is required.'); return }

    // Basic Philippine mobile number validation (09xxxxxxxxx or +639xxxxxxxxx)
    const normalized = accountNumber.trim().replace(/\s/g, '')
    const ph = /^(09\d{9}|\+639\d{9})$/
    if (!ph.test(normalized)) {
      setError('Enter a valid Philippine mobile number (e.g. 09123456789).')
      return
    }

    setSaving(true)
    setError('')
    setSuccess(false)

    if (payout) {
      const { error: updateError } = await supabase
        .from('payout_details')
        .update({
          method,
          account_name: accountName.trim(),
          account_number: normalized,
        })
        .eq('id', payout.id)

      if (updateError) {
        setError('Failed to save. Please try again.')
        setSaving(false)
        return
      }
    } else {
      const { error: insertError } = await supabase
        .from('payout_details')
        .insert({
          user_id: userId,
          method,
          account_name: accountName.trim(),
          account_number: normalized,
        })

      if (insertError) {
        setError('Failed to save. Please try again.')
        setSaving(false)
        return
      }
    }

    setSaving(false)
    setSuccess(true)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#F5F4F1]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#ECE8E0] px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 -ml-1 text-[#1565D8] active:opacity-70"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[#1A1A1A]">Payout Details</h1>
      </div>

      <div className="px-4 py-6 space-y-5">
        {/* Info banner */}
        <div className="bg-[#E7F0FD] rounded-2xl px-4 py-4">
          <p className="text-sm text-[#1565D8] font-semibold mb-1">Where will you receive payments?</p>
          <p className="text-sm text-[#1565D8]">
            Set up your GCash or Maya account. Payments are released within 24 hours of booking completion.
          </p>
        </div>

        {/* Method selector */}
        <div className="bg-white rounded-2xl px-4 py-5">
          <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wide mb-3">
            Payment Method
          </p>
          <div className="grid grid-cols-2 gap-3">
            {METHODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMethod(m.value)}
                className={`border-2 rounded-xl px-4 py-4 text-left transition-all ${
                  method === m.value
                    ? 'border-[#1565D8] bg-[#E7F0FD]'
                    : 'border-[#ECE8E0] bg-white'
                }`}
              >
                <p
                  className="text-base font-bold mb-0.5"
                  style={{ color: method === m.value ? '#1565D8' : m.color }}
                >
                  {m.label}
                </p>
                <p className="text-xs text-[#6B6560] leading-snug">{m.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Account details */}
        <div className="bg-white rounded-2xl px-4 py-5 space-y-4">
          <p className="text-xs font-semibold text-[#6B6560] uppercase tracking-wide">
            Account Details
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#6B6560] uppercase tracking-wide mb-1.5">
              Account Name
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full border border-[#ECE8E0] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#1565D8] transition-colors"
              placeholder="Full name on your account"
            />
            <p className="text-xs text-[#6B6560] mt-1">
              Must match the registered name on your {method === 'gcash' ? 'GCash' : 'Maya'} account.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B6560] uppercase tracking-wide mb-1.5">
              Mobile Number
            </label>
            <input
              type="tel"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full border border-[#ECE8E0] rounded-xl px-4 py-3 text-sm text-[#1A1A1A] outline-none focus:border-[#1565D8] transition-colors"
              placeholder="09xxxxxxxxx"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <p className="text-sm text-green-600">Payout details saved successfully.</p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#1565D8] text-white font-semibold py-3.5 rounded-full text-sm active:bg-[#166FE5] disabled:opacity-60 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Payout Details'}
        </button>

        {/* Security note */}
        <p className="text-xs text-[#6B6560] text-center px-4">
          Your financial information is encrypted and protected under RA 10173 (Data Privacy Act of the Philippines).
        </p>
      </div>
    </div>
  )
}
