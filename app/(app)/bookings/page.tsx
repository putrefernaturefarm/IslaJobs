import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { CalendarCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'

const STATUS_BADGE: Record<string, 'warning' | 'primary' | 'success' | 'error' | 'neutral'> = {
  pending: 'warning',
  accepted: 'primary',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'error',
  disputed: 'error',
}

export default async function BookingsPage() {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', authUser.id)
    .single()

  const isWorker = profile?.role === 'worker' || profile?.role === 'both'
  const isCustomer = profile?.role === 'customer' || profile?.role === 'both'

  // For a 'both'-role account, the empty-state copy should reflect whichever
  // side they're currently viewing as, not just "has worker capability".
  const cookieStore = await cookies()
  const activeView = cookieStore.get('isla_view')?.value === 'customer' ? 'customer' : 'worker'
  const displayAsWorker = profile?.role === 'both' ? activeView === 'worker' : isWorker && !isCustomer

  // Fetch bookings from both sides
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allBookings: any[] = []

  if (isWorker) {
    const { data } = await supabase
      .from('bookings')
      .select(`*, job_posts(title), users!customer_id(first_name, last_name, profile_photo_url)`)
      .eq('worker_id', authUser.id)
      .order('created_at', { ascending: false })
    if (data) allBookings.push(...data)
  }

  if (isCustomer) {
    const { data } = await supabase
      .from('bookings')
      .select(`*, job_posts(title), users!worker_id(first_name, last_name, profile_photo_url)`)
      .eq('customer_id', authUser.id)
      .order('created_at', { ascending: false })
    if (data) allBookings.push(...data)
  }
  // Deduplicate by id
  const seen = new Set<string>()
  const uniqueBookings = allBookings.filter((b) => {
    if (seen.has(b.id)) return false
    seen.add(b.id)
    return true
  })

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 bg-bg-card z-30 px-4 py-3 border-b border-border">
        <h1 className="text-[18px] font-bold text-text-primary">
          {displayAsWorker ? 'Bookings' : 'My Bookings'}
        </h1>
      </div>

      <div className="px-4 py-4">
        {uniqueBookings.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="Nothing here yet"
            description={
              displayAsWorker
                ? 'Paid bookings will appear here once you are hired or accept job offers.'
                : 'Hire someone nearby and your bookings will appear here.'
            }
            primaryAction={
              displayAsWorker ? { label: 'Browse Jobs', href: '/jobs' } : { label: 'Hire a Worker', href: '/workers' }
            }
            tone="success"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {uniqueBookings.map((booking: any) => {
              const isWorkerSide = booking.worker_id === authUser.id
              const otherParty = isWorkerSide ? booking.users : booking.users
              const title = booking.job_posts?.title ?? 'Direct Booking'

              return (
                <Link key={booking.id} href={`/bookings/${booking.id}`}>
                  <Card className="!p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={otherParty?.profile_photo_url}
                        firstName={otherParty?.first_name ?? '?'}
                        lastName={otherParty?.last_name ?? ''}
                        size={44}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-text-primary truncate">{title}</p>
                        <p className="text-[12px] text-text-secondary mt-0.5">
                          {isWorkerSide ? 'Customer' : 'Worker'}:{' '}
                          {otherParty?.first_name} {otherParty?.last_name}
                        </p>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          {formatDate(booking.created_at)}
                        </p>
                      </div>
                      <Badge variant={STATUS_BADGE[booking.status] ?? 'neutral'}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
