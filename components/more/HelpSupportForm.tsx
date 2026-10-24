'use client'

import { useRef, useState } from 'react'
import { AlertTriangle, LifeBuoy, Plus, X } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'

const SUPPORT_EMAIL = 'support@islajobs.ph'

const TOPICS = [
  'Booking issue',
  'Payment issue',
  'Account issue',
  'Technical problem',
  'Safety concern',
  'Other',
]

interface Props {
  userId: string
  fullName: string
  phone: string
  initialEmail: string
}

export default function HelpSupportForm({ userId, fullName, phone, initialEmail }: Props) {
  const supabase = createBrowserClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState(initialEmail)
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState('')
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const canSend = message.trim().length > 0

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('support-attachments')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setUploading(false)
      setError(`Could not upload: ${uploadError.message}`)
      return
    }

    const { data: urlData } = supabase.storage.from('support-attachments').getPublicUrl(path)
    setPhotoUrls((prev) => [...prev, urlData.publicUrl])
    setUploading(false)
  }

  const removePhoto = (url: string) => {
    setPhotoUrls((prev) => prev.filter((u) => u !== url))
  }

  const openSupportEmail = () => {
    window.location.href = `mailto:${SUPPORT_EMAIL}`
  }

  const handleSend = () => {
    if (!canSend) {
      setError('Tell us what happened before sending.')
      return
    }

    setSending(true)
    setError('')

    const subject = encodeURIComponent(`[${topic}] Support request from ${fullName}`)
    const bodyLines = [
      `Name: ${fullName}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      `Topic: ${topic}`,
      '',
      message.trim(),
      photoUrls.length > 0 ? `\nPhotos:\n${photoUrls.join('\n')}` : null,
    ].filter(Boolean)
    const body = encodeURIComponent(bodyLines.join('\n'))

    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`
    setSending(false)
    setSent(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="Help & support"
        rightElement={
          <button
            type="button"
            onClick={openSupportEmail}
            aria-label="Email support directly"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-primary"
          >
            <LifeBuoy size={17} color="#fff" strokeWidth={2} />
          </button>
        }
      />

      <div className="flex-1 pt-14 px-4 pb-6 space-y-4">
        <div
          className="flex items-start gap-2.5 px-4 py-3.5 rounded-[16px] mt-4"
          style={{ background: '#FFF7E6', border: '1.5px solid #FDE4A8' }}
        >
          <AlertTriangle size={17} color="#B45309" strokeWidth={2} className="shrink-0 mt-0.5" />
          <p className="text-[12.5px] leading-snug" style={{ color: '#92400E' }}>
            For urgent safety issues, contact local authorities first before using IslaJobs support.
          </p>
        </div>

        <div className="card !rounded-[20px] flex flex-col gap-4">
          <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary">
            Contact Details
          </p>
          <div>
            <label className="form-label">Full Name</label>
            <input type="text" value={fullName} readOnly className="input-field opacity-70" />
          </div>
          <div>
            <label className="form-label">Phone Number</label>
            <input type="tel" value={phone} readOnly className="input-field opacity-70" />
          </div>
          <div>
            <label className="form-label">Email (optional)</label>
            <p className="text-[13px] text-text-secondary mb-2 -mt-1">
              Optional. Add an email if you prefer updates there.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
            />
          </div>
        </div>

        <div className="card !rounded-[20px] flex flex-col gap-4">
          <div>
            <label className="form-label">What do you need help with?</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="input-field"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Tell us what happened</label>
            <p className="text-[13px] text-text-secondary mb-2 -mt-1">
              Do not include passwords, OTP codes, or sensitive financial information.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Include what you expected, what happened, relevant booking/job IDs, and timestamps."
              className="input-field resize-none"
            />
          </div>
        </div>

        <div className="card !rounded-[20px] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary">
              Photos
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold"
              style={{ background: 'var(--color-primary-xlight)', color: 'var(--color-primary)' }}
            >
              <Plus size={13} strokeWidth={2.5} />
              {uploading ? 'Uploading…' : 'Add'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          <p className="text-[13px] text-text-secondary">Screenshots or photos (optional)</p>
          {photoUrls.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {photoUrls.map((url) => (
                <div key={url} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full aspect-square object-cover rounded-[10px]" />
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    aria-label="Remove photo"
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center"
                  >
                    <X size={11} strokeWidth={3} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="error-text text-center">{error}</p>}
        {sent && (
          <p className="text-[13px] text-success text-center">
            Check your email client to send the message to {SUPPORT_EMAIL}.
          </p>
        )}

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend || sending}
          className="w-full bg-primary text-white font-semibold py-3.5 rounded-full text-sm active:opacity-90 disabled:opacity-50 transition-colors"
        >
          {sending ? 'Preparing…' : 'Send to support'}
        </button>
      </div>
    </div>
  )
}
