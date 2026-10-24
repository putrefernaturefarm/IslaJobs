'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Shield, Eye, PenLine } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/ui/Avatar'
import { TopBar } from '@/components/layout/TopBar'

interface Props {
  profile: {
    id: string
    first_name: string
    last_name: string
    profile_photo_url: string | null
  }
}

const BENEFITS = [
  { Icon: Shield, tone: 'primary' as const, text: 'Builds trust with customers and workers' },
  { Icon: Eye, tone: 'neutral' as const, text: 'Your photo is visible on bookings and job posts' },
  { Icon: PenLine, tone: 'accent' as const, text: 'You can update it anytime from your profile' },
]

const TONE_COLORS = {
  primary: { bg: 'var(--color-primary-light)', fg: 'var(--color-primary)' },
  neutral: { bg: 'var(--color-bg-sunken)', fg: 'var(--color-text-secondary)' },
  accent: { bg: 'var(--color-accent-light)', fg: 'var(--color-accent)' },
}

export default function AddPhotoForm({ profile }: Props) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [savedUrl, setSavedUrl] = useState(profile.profile_photo_url)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setError('')
  }

  const handleSave = async () => {
    if (!selectedFile) {
      router.back()
      return
    }

    setSaving(true)
    setError('')

    const ext = selectedFile.name.split('.').pop()
    const path = `${profile.id}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, selectedFile, { upsert: true })

    if (uploadError) {
      setSaving(false)
      setError(`Could not upload photo: ${uploadError.message}`)
      return
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)

    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_photo_url: urlData.publicUrl })
      .eq('id', profile.id)

    setSaving(false)

    if (updateError) {
      setError('Photo uploaded but failed to save to your profile. Please try again.')
      return
    }

    setSavedUrl(urlData.publicUrl)
    router.push('/home')
    router.refresh()
  }

  const displayUrl = previewUrl ?? savedUrl

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Add Profile Photo" onBack={() => router.back()} />

      <div className="flex-1 pt-14 px-5 pb-6">
        {/* Avatar preview */}
        <div className="flex flex-col items-center mt-6 mb-6">
          <div className="relative">
            <div
              className="rounded-full p-1"
              style={{ border: '2.5px solid var(--color-primary)' }}
            >
              <Avatar
                src={displayUrl}
                firstName={profile.first_name}
                lastName={profile.last_name}
                size={140}
              />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 w-11 h-11 rounded-full bg-primary flex items-center justify-center border-[3px] border-[var(--color-bg-page)]"
              aria-label="Choose photo"
            >
              <Camera size={19} color="#fff" strokeWidth={2} />
            </button>
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
            className="text-[14px] font-semibold text-primary mt-4"
          >
            {displayUrl ? 'Change photo' : 'Choose photo'}
          </button>
        </div>

        {/* Heading */}
        <h1 className="font-display text-[24px] font-semibold text-text-primary text-center leading-tight">
          Add a profile photo
        </h1>
        <p className="text-[14px] text-text-secondary text-center mt-2 mb-6 px-2">
          Help others recognize you. You can update it anytime from your profile.
        </p>

        {/* Benefits card */}
        <div className="card !rounded-[20px] flex flex-col gap-4 mb-6">
          {BENEFITS.map(({ Icon, tone, text }) => {
            const colors = TONE_COLORS[tone]
            return (
              <div key={text} className="flex items-center gap-3.5">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                  style={{ background: colors.bg }}
                >
                  <Icon size={18} color={colors.fg} strokeWidth={1.8} />
                </div>
                <p className="text-[14px] text-text-primary leading-snug">{text}</p>
              </div>
            )
          })}
        </div>

        {error && <p className="error-text text-center mb-4">{error}</p>}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full h-[52px] rounded-full flex items-center justify-center text-[16px] font-semibold text-white bg-primary disabled:opacity-60 transition-opacity"
        >
          {saving ? 'Saving…' : 'Save Photo'}
        </button>
      </div>
    </div>
  )
}
