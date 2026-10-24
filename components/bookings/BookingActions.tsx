'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

interface Props {
  bookingId: string
  status: string
  isWorkerSide: boolean
}

export function BookingActions({ bookingId, status, isWorkerSide }: Props) {
  const supabase = createBrowserClient()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus)
    setError('')
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId)

    if (updateError) {
      setError(
        updateError.message.includes('invalid input value for enum')
          ? `This status ("${newStatus}") is not yet supported by the database. Ask your developer to run the booking_status migration.`
          : `Failed to update: ${updateError.message}`
      )
      setLoading(null)
      return
    }

    router.refresh()
    setLoading(null)
  }

  let actions: React.ReactNode

  if (status === 'pending' && isWorkerSide) {
    actions = (
      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          fullWidth
          loading={loading === 'cancelled'}
          onClick={() => updateStatus('cancelled')}
        >
          Decline
        </Button>
        <Button
          variant="primary"
          fullWidth
          loading={loading === 'accepted'}
          onClick={() => updateStatus('accepted')}
        >
          Accept
        </Button>
      </div>
    )
  } else if (status === 'accepted') {
    actions = (
      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          fullWidth
          loading={loading === 'cancelled'}
          onClick={() => updateStatus('cancelled')}
        >
          Cancel
        </Button>
        {isWorkerSide && (
          <Button
            variant="primary"
            fullWidth
            loading={loading === 'in_progress'}
            onClick={() => updateStatus('in_progress')}
          >
            Start Job
          </Button>
        )}
      </div>
    )
  } else if (status === 'in_progress' && isWorkerSide) {
    actions = (
      <Button
        variant="primary"
        fullWidth
        className="mt-2"
        loading={loading === 'completed'}
        onClick={() => updateStatus('completed')}
      >
        Mark as Completed
      </Button>
    )
  } else if (status === 'pending' && !isWorkerSide) {
    actions = (
      <Button
        variant="secondary"
        fullWidth
        className="mt-2"
        loading={loading === 'cancelled'}
        onClick={() => updateStatus('cancelled')}
      >
        Cancel Request
      </Button>
    )
  } else {
    actions = (
      <p className="text-[13px] text-text-secondary text-center py-3">
        Booking is {status.replace('_', ' ')}
      </p>
    )
  }

  return (
    <>
      {actions}
      {error && <p className="error-text text-center mt-2">{error}</p>}
    </>
  )
}
