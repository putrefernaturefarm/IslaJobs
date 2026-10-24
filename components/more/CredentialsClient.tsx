'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Plus, Upload, Check } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import type { Credential } from '@/types/database'

interface Props {
  userId: string
  initialCredentials: Credential[]
}

export default function CredentialsClient({ userId, initialCredentials }: Props) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [credentials, setCredentials] = useState(initialCredentials)
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [issuer, setIssuer] = useState('')
  const [documentUrl, setDocumentUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openForm = () => setIsAdding(true)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('credentials-docs')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setUploading(false)
      setError(`Could not upload: ${uploadError.message}`)
      return
    }

    const { data: urlData } = supabase.storage.from('credentials-docs').getPublicUrl(path)
    setDocumentUrl(urlData.publicUrl)
    setUploading(false)
  }

  const handleSave = async () => {
    if (!title.trim() || !documentUrl) {
      setError('Add a title and upload the document before saving.')
      return
    }

    setSaving(true)
    setError('')

    const { data: row, error: insertError } = await supabase
      .from('credentials')
      .insert({
        user_id: userId,
        title: title.trim(),
        issuer: issuer.trim() || null,
        document_url: documentUrl,
      })
      .select('id, user_id, title, issuer, document_url, created_at')
      .single()

    setSaving(false)

    if (insertError || !row) {
      setError(
        insertError?.code === 'PGRST205' || insertError?.message?.includes('schema cache')
          ? 'The credentials feature is not yet set up in the database. Ask your developer to run the credentials migration.'
          : 'Failed to save. Please try again.'
      )
      return
    }

    setCredentials((prev) => [row as Credential, ...prev])
    setIsAdding(false)
    setTitle('')
    setIssuer('')
    setDocumentUrl('')
    router.refresh()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="Licenses & Credentials"
        rightElement={
          <button
            type="button"
            onClick={openForm}
            aria-label="Add credential"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-primary"
          >
            <Plus size={18} color="#fff" strokeWidth={2.5} />
          </button>
        }
      />

      <div className="flex-1 pt-14 px-4 pb-6">
        {isAdding && (
          <div className="card !rounded-[20px] flex flex-col gap-3 mt-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Credential title (e.g. TESDA NC II – Electrical)"
              className="input-field"
            />
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Issuing organization (optional)"
              className="input-field"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center justify-center gap-2 py-3 rounded-[14px] border-2 border-dashed"
              style={{
                borderColor: documentUrl ? 'var(--color-success)' : 'var(--color-border)',
                background: documentUrl ? 'var(--color-success-light)' : 'var(--color-bg-sunken)',
              }}
            >
              {documentUrl ? (
                <>
                  <Check size={16} className="text-success" strokeWidth={2.5} />
                  <span className="text-[13px] font-medium text-success">Document uploaded</span>
                </>
              ) : (
                <>
                  <Upload size={16} className="text-text-secondary" strokeWidth={2} />
                  <span className="text-[13px] font-medium text-text-secondary">
                    {uploading ? 'Uploading…' : 'Upload document'}
                  </span>
                </>
              )}
            </button>

            {error && <p className="error-text">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-3 rounded-full text-sm font-semibold text-text-secondary"
                style={{ background: 'var(--color-bg-sunken)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 rounded-full text-sm font-semibold text-white bg-primary disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        )}

        {credentials.length === 0 && !isAdding && (
          <div className="flex flex-col items-center text-center mt-16 px-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'var(--color-success-light)' }}
            >
              <ShieldCheck size={30} color="#16A34A" strokeWidth={1.8} />
            </div>
            <p className="text-[17px] font-bold text-text-primary">No credentials yet</p>
            <p className="text-[13px] text-text-secondary mt-2 max-w-[280px]">
              Add your licenses, TESDA certificates, and other qualifications to build trust with customers.
            </p>
            <button
              type="button"
              onClick={openForm}
              className="mt-5 inline-flex items-center px-6 py-3 rounded-full text-[14px] font-semibold text-white bg-primary"
            >
              Add Credential
            </button>
          </div>
        )}

        {credentials.length > 0 && (
          <div className="flex flex-col gap-2.5 mt-4">
            {credentials.map((c) => (
              <a
                key={c.id}
                href={c.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="card !rounded-[18px] flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-success-light)' }}
                >
                  <ShieldCheck size={18} color="#16A34A" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-text-primary truncate">{c.title}</p>
                  {c.issuer && <p className="text-[12px] text-text-secondary truncate">{c.issuer}</p>}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
