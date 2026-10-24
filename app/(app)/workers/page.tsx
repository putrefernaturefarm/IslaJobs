import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Search, Users, CheckCircle2, MapPin, Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { SaveWorkerButton } from '@/components/workers/SaveWorkerButton'
import { getDistanceKm } from '@/lib/utils'

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string }
}) {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: viewer } = await supabase
    .from('users')
    .select('role, location_lat, location_lng')
    .eq('id', authUser.id)
    .single()

  const cookieStore = await cookies()
  const activeView = cookieStore.get('isla_view')?.value === 'customer' ? 'customer' : 'worker'
  const isCustomerView = viewer?.role === 'customer' || (viewer?.role === 'both' && activeView === 'customer')

  let query = supabase
    .from('users')
    .select(`*, verifications(status)`)
    .in('role', ['worker', 'both'])
    .order('created_at', { ascending: false })

  if (searchParams.q) {
    query = query.or(`first_name.ilike.%${searchParams.q}%,bio.ilike.%${searchParams.q}%`)
  }

  const { data: workers, error: workersError } = await query.limit(50)
  if (workersError) console.error('[workers list] query error:', workersError)

  let savedWorkerIds = new Set<string>()
  if (isCustomerView) {
    const { data: saved } = await supabase
      .from('saved_workers')
      .select('worker_id')
      .eq('customer_id', authUser.id)
    savedWorkerIds = new Set((saved ?? []).map((s) => s.worker_id))
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-bg-card z-30 px-4 py-3 border-b border-border">
        <h1 className="text-[18px] font-bold text-text-primary mb-2">Nearby workers</h1>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <form>
            <input
              name="q"
              defaultValue={searchParams.q}
              placeholder="Search by name or service"
              className="input-field pl-10 !h-11"
            />
          </form>
        </div>
      </div>

      <div className="px-4 py-4">
        {!workers || workers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No workers found"
            description="Check back later, or post a job and let workers come to you."
            primaryAction={{ label: 'Post a Job', href: '/jobs/post' }}
            tone="success"
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary">
                Nearby Workers
              </p>
              <p className="text-[12px] text-text-secondary">{workers.length} found</p>
            </div>

            <div className="flex flex-col gap-3">
              {workers.map((worker: any) => {
                const verifications = worker.verifications ?? []
                const isVerified = verifications.some((v: any) => v.status === 'approved')
                const distanceKm =
                  viewer?.location_lat && viewer?.location_lng && worker.location_lat && worker.location_lng
                    ? getDistanceKm(viewer.location_lat, viewer.location_lng, worker.location_lat, worker.location_lng)
                    : null

                return (
                  <Link key={worker.id} href={`/workers/${worker.id}`}>
                    <Card className="!p-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={worker.profile_photo_url}
                          firstName={worker.first_name ?? '?'}
                          lastName={worker.last_name ?? ''}
                          size={52}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[15px] font-semibold text-text-primary truncate">
                              {worker.first_name} {worker.last_name}
                            </p>
                            {isVerified && (
                              <Badge variant="success" className="inline-flex items-center gap-1 !py-0.5">
                                <CheckCircle2 size={11} strokeWidth={2.2} />
                                Verified
                              </Badge>
                            )}
                          </div>
                          {worker.bio && (
                            <p className="text-[12px] text-text-secondary mt-0.5 line-clamp-1">
                              {worker.bio}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-1">
                            <span className="inline-flex items-center gap-1 text-[12px] text-text-secondary">
                              <Star size={12} color="#D97706" fill="#D97706" strokeWidth={0} />
                              No ratings yet
                            </span>
                            {distanceKm !== null && (
                              <span className="inline-flex items-center gap-1 text-[12px]" style={{ color: '#16A34A' }}>
                                <MapPin size={12} strokeWidth={2} />
                                {distanceKm.toFixed(1)} km
                              </span>
                            )}
                          </div>
                        </div>
                        {isCustomerView && (
                          <SaveWorkerButton
                            customerId={authUser.id}
                            workerId={worker.id}
                            initialSaved={savedWorkerIds.has(worker.id)}
                          />
                        )}
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
