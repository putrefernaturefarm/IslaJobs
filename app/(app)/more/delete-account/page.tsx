'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle, Trash2, XCircle, Archive, Clock, Info, Calendar, AlertCircle,
} from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'

const SUPPORT_EMAIL = 'privacy@islajobs.ph'

const DELETED_ITEMS = [
  'Your name, phone number, and profile photo',
  'Your bio, availability, and credentials',
  'Your chat messages and conversations',
  'Your notifications and activity history',
  'Your verification documents',
  'Your job posts and booking history',
]

const KEPT_ITEMS = [
  'Booking records, kept briefly for accurate historical record-keeping',
]

const BEFORE_DELETE_ITEMS: { Icon: typeof Calendar; text: string }[] = [
  { Icon: Calendar, text: 'Complete or cancel any active bookings first.' },
  { Icon: AlertCircle, text: "Deletion is permanent. You'll need a new account to return." },
]

export default function DeleteAccountPage() {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [confirmed, setConfirmed] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleRequest = async () => {
    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    setSending(false)
    setSent(true)

    const subject = encodeURIComponent('Account deletion request')
    const body = encodeURIComponent(
      `I would like to permanently delete my IslaJobs account.\n\nAccount email: ${user?.email ?? ''}\nAccount ID: ${user?.id ?? ''}`
    )
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Delete Account" onBack={() => router.back()} />

      <div className="flex-1 pt-14 px-4 pb-6 space-y-4">
        <div className="flex flex-col items-center text-center mt-4 mb-1">
          <div className="w-16 h-16 rounded-full bg-error-light flex items-center justify-center mb-4">
            <AlertTriangle size={30} className="text-error" strokeWidth={1.8} />
          </div>
          <h1 className="text-[20px] font-bold text-text-primary">Delete your account</h1>
          <p className="text-[14px] text-text-secondary mt-2 max-w-[300px]">
            This permanently removes your profile, bookings, messages, and job history. This cannot be undone.
          </p>
        </div>

        <div className="card !rounded-[20px]">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-error-light shrink-0">
              <Trash2 size={17} className="text-error" strokeWidth={1.8} />
            </div>
            <h2 className="text-[15px] font-bold text-text-primary">What gets deleted</h2>
          </div>
          <div className="flex flex-col gap-3">
            {DELETED_ITEMS.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <XCircle size={16} className="text-error mt-0.5 shrink-0" strokeWidth={2} />
                <p className="text-[13.5px] text-text-secondary leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card !rounded-[20px]">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: '#FEF3C7' }}
            >
              <Archive size={17} color="#B45309" strokeWidth={1.8} />
            </div>
            <h2 className="text-[15px] font-bold text-text-primary">What we keep (required by law)</h2>
          </div>
          <div className="flex flex-col gap-3">
            {KEPT_ITEMS.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <Clock size={16} color="#D97706" className="mt-0.5 shrink-0" strokeWidth={2} />
                <p className="text-[13.5px] text-text-secondary leading-snug">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-text-tertiary mt-3">
            Retained data is anonymized and only kept as long as legally required.
          </p>
        </div>

        <div className="card !rounded-[20px]">
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
              style={{ background: 'var(--color-success-light)' }}
            >
              <Info size={17} color="#16A34A" strokeWidth={1.8} />
            </div>
            <h2 className="text-[15px] font-bold text-text-primary">Before you delete</h2>
          </div>
          <div className="flex flex-col gap-3">
            {BEFORE_DELETE_ITEMS.map(({ Icon, text }) => (
              <div key={text} className="flex items-start gap-2.5">
                <Icon size={16} color="#16A34A" className="mt-0.5 shrink-0" strokeWidth={2} />
                <p className="text-[13.5px] text-text-secondary leading-snug">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[12.5px] text-text-tertiary leading-relaxed px-1">
          Account deletion is processed by our support team to protect against accidental or
          unauthorized requests. We&apos;ll confirm and complete the deletion within a few business days.
        </p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-5 h-5 accent-primary shrink-0"
          />
          <span className="text-[13px] text-text-primary leading-relaxed">
            I understand this will permanently delete my account and all associated data.
          </span>
        </label>

        {sent ? (
          <p className="text-[13px] text-success text-center">
            Request sent. Check your email client to send the message to {SUPPORT_EMAIL}.
          </p>
        ) : (
          <>
            <button
              type="button"
              disabled={!confirmed || sending}
              onClick={handleRequest}
              className="w-full h-[52px] rounded-full flex items-center justify-center gap-2 text-[15px] font-semibold disabled:opacity-50 transition-opacity bg-error-light text-error"
            >
              <Trash2 size={17} strokeWidth={2} />
              {sending ? 'Preparing…' : 'Delete My Account'}
            </button>
            <p className="text-[12px] text-text-tertiary text-center">
              You&apos;ll be asked to confirm before anything is deleted.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
