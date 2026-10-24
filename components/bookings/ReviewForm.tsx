'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'

interface Props {
  bookingId: string
  customerId: string
  workerId: string
}

const TAG_OPTIONS = [
  'On time', 'Skilled', 'Friendly', 'Reliable', 'Honest',
  'Clean & tidy', 'Good communication', 'Would hire again', 'Goes the extra mile',
]

export default function ReviewForm({ bookingId, customerId, workerId }: Props) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [rating, setRating] = useState(0)
  const [tags, setTags] = useState<string[]>([])
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Tap a star to rate this worker.')
      return
    }

    setSaving(true)
    setError('')

    const { error: saveError } = await supabase.from('reviews').insert({
      booking_id: bookingId,
      customer_id: customerId,
      worker_id: workerId,
      rating,
      tags,
      comment: comment.trim() || null,
    })

    setSaving(false)

    if (saveError) {
      setError(
        saveError.code === 'PGRST205' || saveError.message.includes('schema cache')
          ? 'The reviews feature is not yet set up in the database. Ask your developer to run the reviews migration.'
          : 'Failed to save your review. Please try again.'
      )
      return
    }

    router.refresh()
  }

  return (
    <div className="card !rounded-[20px]">
      <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-3">
        Leave a Review
      </p>

      <div className="flex items-center justify-center gap-1.5 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} type="button" onClick={() => setRating(i)} aria-label={`Rate ${i} stars`}>
            <Star size={28} color="#D97706" fill={i <= rating ? '#D97706' : 'none'} strokeWidth={1.5} />
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TAG_OPTIONS.map((tag) => {
          const active = tags.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-full transition-colors"
              style={{
                background: active ? 'var(--color-success-light)' : 'var(--color-bg-sunken)',
                color: active ? '#16A34A' : 'var(--color-text-secondary)',
              }}
            >
              {tag}
            </button>
          )
        })}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Share more about your experience (optional)"
        className="input-field resize-none mb-3"
      />

      {error && <p className="error-text mb-3">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={saving}
        className="w-full bg-primary text-white font-semibold py-3 rounded-full text-sm active:opacity-90 disabled:opacity-60"
      >
        {saving ? 'Submitting…' : 'Submit Review'}
      </button>
    </div>
  )
}
