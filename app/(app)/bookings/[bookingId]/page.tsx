import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { BookingActions } from '@/components/bookings/BookingActions'
import ReviewForm from '@/components/bookings/ReviewForm'
import { MapPin, FileText, Calendar, Clock } from 'lucide-react'
import { formatDate, formatCurrency } from '@/lib/utils'

const STATUS_BADGE: Record<string, 'warning' | 'primary' | 'success' | 'error' | 'neutral'> = {
  pending: 'warning',
  accepted: 'primary',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'error',
  rejected: 'error',
}

export default async function BookingDetailPage({
  params,
}: {
  params: { bookingId: string }
}) {
  const supabase = await createServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: booking } = await supabase
    .from('bookings')
    .select(`
      *,
      job_posts(*),
      worker:users!worker_id(id, first_name, last_name, profile_photo_url),
      customer:users!customer_id(id, first_name, last_name, profile_photo_url)
    `)
    .eq('id', params.bookingId)
    .single()

  if (!booking) notFound()

  const isWorkerSide = booking.worker_id === authUser.id
  const isCustomerSide = booking.customer_id === authUser.id
  if (!isWorkerSide && !isCustomerSide) notFound()

  const otherParty: any = isWorkerSide ? booking.customer : booking.worker
  const jobPost: any = booking.job_posts

  const { data: existingReview } = await supabase
    .from('reviews')
    .select('id')
    .eq('booking_id', booking.id)
    .maybeSingle()

  const canReview = isCustomerSide && booking.status === 'completed' && !existingReview

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Booking" />

      <div className="pt-14 px-4 pb-8 space-y-4">
        <Card>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <p className="text-[18px] font-bold text-text-primary">{jobPost?.title ?? 'Direct Booking'}</p>
              <p className="text-[12px] text-text-tertiary mt-0.5">
                Created {formatDate(booking.created_at)}
              </p>
            </div>
            <Badge variant={STATUS_BADGE[booking.status] ?? 'neutral'}>
              {booking.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="flex items-center gap-3 py-3 border-t border-border">
            <Avatar
              src={otherParty?.profile_photo_url}
              firstName={otherParty?.first_name ?? '?'}
              lastName={otherParty?.last_name ?? ''}
              size={44}
            />
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary">
                {isWorkerSide ? 'Customer' : 'Worker'}
              </p>
              <p className="text-[14px] font-semibold text-text-primary">
                {otherParty?.first_name} {otherParty?.last_name}
              </p>
            </div>
          </div>
        </Card>

        {jobPost && (
          <Card className="flex flex-col gap-3">
            <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary">
              Job Details
            </p>
            <div className="flex items-start gap-2.5">
              <FileText size={15} className="text-text-tertiary mt-0.5 shrink-0" />
              <p className="text-[14px] text-text-primary leading-relaxed">{jobPost.description}</p>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-text-tertiary mt-0.5 shrink-0" />
              <p className="text-[14px] text-text-primary leading-relaxed">{jobPost.address}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <Calendar size={15} className="text-text-tertiary shrink-0" />
              <p className="text-[14px] text-text-primary">
                {formatDate(jobPost.scheduled_date)}
              </p>
            </div>
            {jobPost.estimated_hours && (
              <div className="flex items-center gap-2.5">
                <Clock size={15} className="text-text-tertiary shrink-0" />
                <p className="text-[14px] text-text-primary">{jobPost.estimated_hours} hours estimated</p>
              </div>
            )}
            <div className="pt-2 border-t border-border">
              <p className="text-[16px] font-bold" style={{ color: '#16A34A' }}>
                {formatCurrency(jobPost.budget_max)}
                {jobPost.pricing_type === 'hourly' ? ' / hour' : ' fixed price'}
              </p>
              <p className="text-[12px] text-text-tertiary mt-1">
                IslaJobs does not process payment in-app. Payment is arranged directly between
                customer and worker.
              </p>
            </div>
          </Card>
        )}

        <Card>
          <BookingActions bookingId={booking.id} status={booking.status} isWorkerSide={isWorkerSide} />
        </Card>

        {canReview && (
          <ReviewForm bookingId={booking.id} customerId={authUser.id} workerId={booking.worker_id} />
        )}

        {existingReview && isCustomerSide && (
          <p className="text-[13px] text-text-secondary text-center">
            You&apos;ve already reviewed this booking. Thank you!
          </p>
        )}
      </div>
    </div>
  )
}
