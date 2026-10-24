'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Image as ImageIcon, Plus } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import type { WorkerPhoto } from '@/types/database'

interface Props {
  userId: string
  initialPhotos: WorkerPhoto[]
}

export default function GalleryClient({ userId, initialPhotos }: Props) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [photos, setPhotos] = useState(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('gallery-photos')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setUploading(false)
      setError(`Could not upload: ${uploadError.message}`)
      return
    }

    const { data: urlData } = supabase.storage.from('gallery-photos').getPublicUrl(path)

    const { data: row, error: insertError } = await supabase
      .from('worker_photos')
      .insert({ user_id: userId, photo_url: urlData.publicUrl })
      .select('id, user_id, photo_url, created_at')
      .single()

    setUploading(false)

    if (insertError || !row) {
      setError(
        insertError?.code === 'PGRST205' || insertError?.message?.includes('schema cache')
          ? 'The gallery feature is not yet set up in the database. Ask your developer to run the gallery migration.'
          : 'Photo uploaded but failed to save. Please try again.'
      )
      return
    }

    setPhotos((prev) => [row as WorkerPhoto, ...prev])
    router.refresh()
  }

  const triggerUpload = () => fileInputRef.current?.click()

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="My gallery"
        rightElement={
          <button
            type="button"
            onClick={triggerUpload}
            disabled={uploading}
            aria-label="Add photo"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-primary disabled:opacity-60"
          >
            <Plus size={18} color="#fff" strokeWidth={2.5} />
          </button>
        }
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex-1 pt-14 px-4 pb-6">
        {error && <p className="error-text text-center mt-4">{error}</p>}

        {photos.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-16 px-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'var(--color-success-light)' }}
            >
              <ImageIcon size={30} color="#16A34A" strokeWidth={1.8} />
            </div>
            <p className="text-[17px] font-bold text-text-primary">No photos in your gallery yet</p>
            <p className="text-[13px] text-text-secondary mt-2 max-w-[280px]">
              Upload photos of your work, tools, or finished projects to make your profile stand out.
            </p>
            <button
              type="button"
              onClick={triggerUpload}
              disabled={uploading}
              className="mt-5 inline-flex items-center px-6 py-3 rounded-full text-[14px] font-semibold text-white bg-primary disabled:opacity-60"
            >
              {uploading ? 'Uploading…' : 'Add photos'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 mt-4">
            {photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photo.photo_url}
                alt=""
                className="w-full aspect-square object-cover rounded-[14px]"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
