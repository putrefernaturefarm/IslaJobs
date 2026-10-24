'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldOff, CheckCircle2, Upload, Check } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import type { Verification, VerificationStatus } from '@/types/database'

interface Props {
  userId: string
  verification: Verification | null
}

const STATUS_CONFIG: Record<
  VerificationStatus,
  { label: string; description: string }
> = {
  not_submitted: {
    label: 'Unverified',
    description:
      'To protect both customers and workers, a valid government ID and a recent Police Clearance are required before granting a Verified badge. Submit documents below to start the review.',
  },
  pending: {
    label: 'Under Review',
    description: 'We are reviewing your documents. This usually takes 1–2 business days.',
  },
  approved: {
    label: 'Verified',
    description: 'Your identity has been verified. A verified badge appears on your profile.',
  },
  rejected: {
    label: 'Rejected',
    description: 'Your submission was rejected. Please resubmit with valid documents.',
  },
}

const ID_TYPES = [
  "Driver's License",
  'Philippine Passport',
  'UMID',
  'PhilSys National ID',
  'SSS ID',
  'PRC ID',
  "Voter's ID",
  'Postal ID',
  'Others',
]

export default function VerificationForm({ userId, verification }: Props) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const status: VerificationStatus = (verification?.status as VerificationStatus) ?? 'not_submitted'
  const config = STATUS_CONFIG[status]
  const canEdit = status === 'not_submitted' || status === 'rejected'

  const [idType, setIdType] = useState(verification?.id_type ?? '')
  const [idNumber, setIdNumber] = useState(verification?.id_number ?? '')
  const [idFrontUrl, setIdFrontUrl] = useState(verification?.id_front_url ?? '')
  const [idBackUrl, setIdBackUrl] = useState(verification?.id_back_url ?? '')
  const [policeRef, setPoliceRef] = useState(verification?.police_clearance_ref ?? '')
  const [policeDate, setPoliceDate] = useState(verification?.police_clearance_date ?? '')
  const [policeDocUrl, setPoliceDocUrl] = useState(verification?.police_clearance_url ?? '')

  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const uploadFile = async (file: File, field: string, setUrl: (url: string) => void) => {
    setUploadingField(field)
    setError('')

    const ext = file.name.split('.').pop()
    const path = `${userId}/${field}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('verification-docs')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setUploadingField(null)
      setError(`Could not upload: ${uploadError.message}`)
      return
    }

    const { data: urlData } = supabase.storage.from('verification-docs').getPublicUrl(path)
    setUrl(urlData.publicUrl)
    setUploadingField(null)
  }

  const canSubmit =
    idType && idNumber.trim() && idFrontUrl && idBackUrl && policeRef.trim() && policeDate && policeDocUrl

  const handleSubmit = async () => {
    if (!canSubmit) {
      setError('Please complete all required fields and uploads before submitting.')
      return
    }

    setSaving(true)
    setError('')

    const payload = {
      id_type: idType,
      id_number: idNumber.trim(),
      id_front_url: idFrontUrl,
      id_back_url: idBackUrl,
      police_clearance_ref: policeRef.trim(),
      police_clearance_date: policeDate,
      police_clearance_url: policeDocUrl,
      status: 'pending' as const,
      submitted_at: new Date().toISOString(),
      rejection_reason: null,
    }

    const { error: saveError } = verification
      ? await supabase.from('verifications').update(payload).eq('id', verification.id)
      : await supabase.from('verifications').insert({ user_id: userId, ...payload })

    setSaving(false)

    if (saveError) {
      setError('Submission failed. Please try again.')
      return
    }

    setSubmitted(true)
    router.refresh()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Verification" onBack={() => router.back()} />

      <div className="flex-1 pt-14 px-4 pb-6 space-y-5">
        {/* Status card */}
        <div className="card !rounded-[20px] flex items-start gap-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: status === 'approved' ? 'var(--color-success-light)' : 'var(--color-error-light)',
            }}
          >
            {status === 'approved' ? (
              <CheckCircle2 size={20} className="text-success" strokeWidth={2} />
            ) : (
              <ShieldOff size={20} className="text-error" strokeWidth={2} />
            )}
          </div>
          <div>
            <p className="text-[17px] font-bold text-text-primary">{config.label}</p>
            <p className="text-[14px] text-text-secondary mt-1 leading-relaxed">{config.description}</p>
            {verification?.rejection_reason && (
              <p className="text-[13px] text-error mt-2 font-medium">
                Reason: {verification.rejection_reason}
              </p>
            )}
          </div>
        </div>

        {/* Requirements */}
        <div className="card !rounded-[20px] flex flex-col gap-3">
          <p className="text-[11px] font-bold tracking-widest uppercase text-text-secondary">
            Requirements
          </p>
          {['One valid government ID (PhilID, Driver’s License, Passport, etc.)', 'Recent Police Clearance'].map((req) => (
            <div key={req} className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" strokeWidth={2} />
              <p className="text-[14px] text-text-primary leading-snug">{req}</p>
            </div>
          ))}
        </div>

        {canEdit && !submitted && (
          <>
            {/* Upload documents */}
            <div className="card !rounded-[20px] flex flex-col gap-4">
              <p className="text-[11px] font-bold tracking-widest uppercase text-text-secondary">
                Upload Documents
              </p>

              <div>
                <label className="form-label">ID Type</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="input-field"
                >
                  <option value="">ID type</option>
                  {ID_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">ID Number</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="input-field"
                  placeholder="Enter the number on your ID"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <UploadTile
                  label="ID Front"
                  uploaded={Boolean(idFrontUrl)}
                  uploading={uploadingField === 'id-front'}
                  onSelect={(file) => uploadFile(file, 'id-front', setIdFrontUrl)}
                />
                <UploadTile
                  label="ID Back"
                  uploaded={Boolean(idBackUrl)}
                  uploading={uploadingField === 'id-back'}
                  onSelect={(file) => uploadFile(file, 'id-back', setIdBackUrl)}
                />
              </div>
            </div>

            {/* Police clearance */}
            <div className="card !rounded-[20px] flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-bold tracking-widest uppercase text-text-secondary">
                  Police Clearance
                </p>
                <span className="badge-success">Required</span>
              </div>

              <div>
                <label className="form-label">Reference / Control Number</label>
                <input
                  type="text"
                  value={policeRef}
                  onChange={(e) => setPoliceRef(e.target.value)}
                  className="input-field"
                  placeholder="e.g. 2024-000123"
                />
              </div>

              <div>
                <label className="form-label">Date Issued</label>
                <input
                  type="date"
                  value={policeDate ?? ''}
                  onChange={(e) => setPoliceDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="form-label mb-2">Police Clearance Document</label>
                <UploadTile
                  label="Police Clearance Document"
                  wide
                  uploaded={Boolean(policeDocUrl)}
                  uploading={uploadingField === 'police-clearance'}
                  onSelect={(file) => uploadFile(file, 'police-clearance', setPoliceDocUrl)}
                />
              </div>
            </div>

            {error && <p className="error-text text-center">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={saving || !canSubmit}
              className="w-full bg-primary text-white font-semibold py-3.5 rounded-full text-sm active:opacity-90 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Submitting…' : 'Submit for review'}
            </button>
          </>
        )}

        {submitted && (
          <div className="bg-success-light rounded-2xl px-4 py-5 text-center">
            <p className="text-success font-semibold mb-1">Submitted!</p>
            <p className="text-[13px] text-success">
              We will review your documents within 1–2 business days.
            </p>
          </div>
        )}

        {verification && !canEdit && (
          <div className="card !rounded-[20px] flex flex-col gap-3">
            <p className="text-[11px] font-bold tracking-widest uppercase text-text-secondary">
              Submitted Info
            </p>
            <div>
              <p className="text-xs text-text-secondary">ID Type</p>
              <p className="text-sm font-medium text-text-primary">{verification.id_type}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">ID Number</p>
              <p className="text-sm font-medium text-text-primary">
                {'•'.repeat(Math.max(0, (verification.id_number ?? '').length - 4))}
                {(verification.id_number ?? '').slice(-4)}
              </p>
            </div>
            {verification.submitted_at && (
              <div>
                <p className="text-xs text-text-secondary">Submitted</p>
                <p className="text-sm font-medium text-text-primary">
                  {new Date(verification.submitted_at).toLocaleDateString('en-PH', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function UploadTile({
  label,
  uploaded,
  uploading,
  wide,
  onSelect,
}: {
  label: string
  uploaded: boolean
  uploading: boolean
  wide?: boolean
  onSelect: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={uploading}
      className={`flex flex-col items-center justify-center gap-2 rounded-[16px] border-2 border-dashed transition-colors ${wide ? 'w-full py-10' : 'py-7'}`}
      style={{
        borderColor: uploaded ? 'var(--color-success)' : 'var(--color-border)',
        background: uploaded ? 'var(--color-success-light)' : 'var(--color-bg-sunken)',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onSelect(file)
        }}
      />
      <span
        className="w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: 'var(--color-bg-card)' }}
      >
        {uploaded ? (
          <Check size={16} className="text-success" strokeWidth={2.5} />
        ) : (
          <Upload size={16} className="text-text-secondary" strokeWidth={2} />
        )}
      </span>
      <span className="text-[13px] font-medium" style={{ color: uploaded ? 'var(--color-success)' : 'var(--color-text-secondary)' }}>
        {uploading ? 'Uploading…' : uploaded ? 'Uploaded' : 'Tap to upload'}
      </span>
    </button>
  )
}
