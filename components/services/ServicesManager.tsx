'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Briefcase, Upload, Check, Pencil, Trash2 } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import type { Service, PricingType } from '@/types/database'

interface Props {
  workerId: string
  initialServices: Service[]
}

const emptyDraft = {
  id: '',
  title: '',
  description: '',
  price: '',
  pricingType: 'fixed' as PricingType,
  photoUrl: '',
}

export default function ServicesManager({ workerId, initialServices }: Props) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [services, setServices] = useState(initialServices)
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const openAdd = () => {
    setDraft(emptyDraft)
    setIsOpen(true)
  }

  const openEdit = (service: Service) => {
    setDraft({
      id: service.id,
      title: service.title,
      description: service.description,
      price: String(service.price),
      pricingType: service.pricing_type,
      photoUrl: service.photo_url ?? '',
    })
    setIsOpen(true)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const ext = file.name.split('.').pop()
    const path = `${workerId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('service-photos')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setUploading(false)
      setError(`Could not upload: ${uploadError.message}`)
      return
    }

    const { data: urlData } = supabase.storage.from('service-photos').getPublicUrl(path)
    setDraft((d) => ({ ...d, photoUrl: urlData.publicUrl }))
    setUploading(false)
  }

  const handleSave = async () => {
    const price = Number(draft.price)
    if (!draft.title.trim() || !draft.description.trim() || !price || price <= 0) {
      setError('Add a title, description, and a price greater than 0.')
      return
    }

    setSaving(true)
    setError('')

    const payload = {
      worker_id: workerId,
      title: draft.title.trim(),
      description: draft.description.trim(),
      price,
      pricing_type: draft.pricingType,
      photo_url: draft.photoUrl || null,
    }

    const { data: row, error: saveError } = draft.id
      ? await supabase.from('services').update(payload).eq('id', draft.id).select('*').single()
      : await supabase.from('services').insert(payload).select('*').single()

    setSaving(false)

    if (saveError || !row) {
      setError(
        saveError?.code === 'PGRST205' || saveError?.message?.includes('schema cache')
          ? 'The services feature is not yet set up in the database. Ask your developer to run the services migration.'
          : 'Failed to save. Please try again.'
      )
      return
    }

    setServices((prev) =>
      draft.id ? prev.map((s) => (s.id === row.id ? (row as Service) : s)) : [row as Service, ...prev]
    )
    setIsOpen(false)
    router.refresh()
  }

  const handleDelete = async (id: string) => {
    await supabase.from('services').delete().eq('id', id)
    setServices((prev) => prev.filter((s) => s.id !== id))
    router.refresh()
  }

  return (
    <div className="bg-[var(--color-bg-card)] rounded-2xl px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
          My Service Listings
        </p>
        <button
          type="button"
          onClick={openAdd}
          aria-label="Add service"
          className="w-8 h-8 rounded-full flex items-center justify-center bg-primary"
        >
          <Plus size={16} color="#fff" strokeWidth={2.5} />
        </button>
      </div>

      {services.length === 0 && !isOpen && (
        <div className="flex flex-col items-center text-center py-6">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
            style={{ background: 'var(--color-primary-xlight)' }}
          >
            <Briefcase size={20} color="var(--color-primary)" strokeWidth={1.8} />
          </div>
          <p className="text-[13px] text-[var(--color-text-secondary)]">
            No services listed yet. Add one so customers know what you offer and how much it costs.
          </p>
        </div>
      )}

      {services.length > 0 && (
        <div className="flex flex-col gap-2 mb-1">
          {services.map((service) => (
            <div key={service.id} className="flex items-center gap-3 py-2">
              <div className="w-12 h-12 rounded-[10px] overflow-hidden shrink-0 bg-[var(--color-bg-sunken)]">
                {service.photo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={service.photo_url} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate">
                  {service.title}
                </p>
                <p className="text-[12px] font-semibold" style={{ color: '#16A34A' }}>
                  ₱{service.price.toLocaleString()} {service.pricing_type === 'hourly' ? '/ hour' : 'fixed price'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openEdit(service)}
                aria-label="Edit service"
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-bg-sunken)' }}
              >
                <Pencil size={14} className="text-[var(--color-text-secondary)]" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(service.id)}
                aria-label="Delete service"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-error-light"
              >
                <Trash2 size={14} className="text-error" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-[var(--color-border)]">
          <input
            type="text"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="Service title (e.g. Home Cleaning)"
            className="input-field"
          />
          <textarea
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            placeholder="Describe what's included in this service"
            rows={3}
            className="input-field resize-none"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min={1}
              value={draft.price}
              onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
              placeholder="Price (PHP)"
              className="input-field flex-1"
            />
            <select
              value={draft.pricingType}
              onChange={(e) => setDraft((d) => ({ ...d, pricingType: e.target.value as PricingType }))}
              className="input-field flex-1"
            >
              <option value="fixed">Fixed price</option>
              <option value="hourly">Per hour</option>
            </select>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 py-3 rounded-[14px] border-2 border-dashed"
            style={{
              borderColor: draft.photoUrl ? 'var(--color-success)' : 'var(--color-border)',
              background: draft.photoUrl ? 'var(--color-success-light)' : 'var(--color-bg-sunken)',
            }}
          >
            {draft.photoUrl ? (
              <>
                <Check size={16} className="text-success" strokeWidth={2.5} />
                <span className="text-[13px] font-medium text-success">Photo added</span>
              </>
            ) : (
              <>
                <Upload size={16} className="text-[var(--color-text-secondary)]" strokeWidth={2} />
                <span className="text-[13px] font-medium text-[var(--color-text-secondary)]">
                  {uploading ? 'Uploading…' : 'Add a photo (optional)'}
                </span>
              </>
            )}
          </button>

          {error && <p className="error-text">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 py-3 rounded-full text-sm font-semibold text-[var(--color-text-secondary)]"
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
              {saving ? 'Saving…' : draft.id ? 'Save changes' : 'Add service'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
