import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Avatar } from '@/components/ui/Avatar'
import { Card } from '@/components/ui/Card'
import { HireConfirmDialog } from '@/components/workers/HireConfirmDialog'
import { SaveWorkerButton } from '@/components/workers/SaveWorkerButton'
import { Check, MapPin, Navigation, Wrench, Star, ChevronRight } from 'lucide-react'
import { getDistanceKm, formatDate } from '@/lib/utils'

export default async function WorkerDetailPage({
  params,
}: {
  params: { workerId: string }
}) {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: worker } = await supabase
    .from('users')
    .select(`*, verifications(status, created_at)`)
    .eq('id', params.workerId)
    .single()

  if (!worker) notFound()

  const { data: viewer } = await supabase
    .from('users')
    .select('location_lat, location_lng')
    .eq('id', authUser.id)
    .single()

  const verifications = (worker as any).verifications ?? []
  const isVerified = verifications.some((v: any) => v.status === 'approved')
  const isOwnProfile = authUser.id === worker.id

  const locationParts = [
    (worker as any).barangay,
    (worker as any).city,
    (worker as any).province,
  ].filter(Boolean)
  const locationText = locationParts.join(', ')

  const distanceKm =
    viewer?.location_lat && viewer?.location_lng && worker.location_lat && worker.location_lng
      ? getDistanceKm(viewer.location_lat, viewer.location_lng, worker.location_lat, worker.location_lng)
      : null

  let isSaved = false
  if (!isOwnProfile) {
    const { data: savedRow } = await supabase
      .from('saved_workers')
      .select('id')
      .eq('customer_id', authUser.id)
      .eq('worker_id', worker.id)
      .maybeSingle()
    isSaved = Boolean(savedRow)
  }

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('worker_id', worker.id)
    .order('created_at', { ascending: false })

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, customer:users!customer_id(first_name, last_name)')
    .eq('worker_id', worker.id)
    .order('created_at', { ascending: false })
    .limit(2)

  const { count: reviewCount } = await supabase
    .from('reviews')
    .select('id', { count: 'exact', head: true })
    .eq('worker_id', worker.id)

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
      : null

  const { data: photos } = await supabase
    .from('worker_photos')
    .select('id, photo_url')
    .eq('user_id', worker.id)
    .order('created_at', { ascending: false })
    .limit(12)

  const workerName = `${worker.first_name} ${worker.last_name}`

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Worker profile" />

      <div className="pt-14 px-4 pb-28 space-y-4">
        {/* Header */}
        <Card className="flex flex-col items-center text-center !py-6 relative">
          {!isOwnProfile && (
            <div className="absolute top-4 right-4">
              <SaveWorkerButton customerId={authUser.id} workerId={worker.id} initialSaved={isSaved} />
            </div>
          )}
          <div className="relative">
            <Avatar
              src={worker.profile_photo_url}
              firstName={worker.first_name ?? '?'}
              lastName={worker.last_name ?? ''}
              size={84}
            />
            {isVerified && (
              <span
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center border-2"
                style={{ background: '#16A34A', borderColor: 'var(--color-bg-card)' }}
              >
                <Check size={13} color="#fff" strokeWidth={3} />
              </span>
            )}
          </div>

          <h1 className="mt-3 text-[20px] font-bold text-text-primary">{workerName}</h1>

          {avgRating !== null ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={13}
                    color="#D97706"
                    fill={i <= Math.round(avgRating) ? '#D97706' : 'none'}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="text-[13px] font-semibold text-text-primary">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-[13px] text-text-secondary">· {reviewCount} reviews</span>
            </div>
          ) : (
            <p className="text-[13px] text-text-secondary mt-0.5">No ratings yet</p>
          )}

          {locationText && (
            <div className="flex items-center gap-1.5 mt-2">
              <MapPin size={14} className="text-text-tertiary shrink-0" />
              <span className="text-[13px] text-text-secondary">{locationText}</span>
            </div>
          )}

          {distanceKm !== null && (
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mt-2.5"
              style={{ background: '#DCFCE7' }}
            >
              <Navigation size={12} color="#16A34A" strokeWidth={2} />
              <span className="text-[12px] font-semibold" style={{ color: '#16A34A' }}>
                {distanceKm.toFixed(1)} km away
              </span>
            </div>
          )}
        </Card>

        {/* About */}
        {worker.bio && (
          <Card>
            <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-2">
              About
            </p>
            <p className="text-[15px] text-text-primary leading-relaxed">{worker.bio}</p>
          </Card>
        )}

        {/* Services */}
        <Card>
          <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-3">
            Services
          </p>
          {!services || services.length === 0 ? (
            <div className="flex flex-col items-center text-center py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={{ background: '#DCFCE7' }}
              >
                <Wrench size={26} color="#16A34A" strokeWidth={1.8} />
              </div>
              <p className="text-[15px] font-bold text-text-primary">Services</p>
              <p className="text-[13px] text-text-secondary mt-1">
                This worker hasn&apos;t added services yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {services.map((service: any) => (
                <div key={service.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[10px] overflow-hidden shrink-0 bg-bg-sunken">
                    {service.photo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={service.photo_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-text-primary truncate">{service.title}</p>
                    <p className="text-[12.5px] text-text-secondary truncate">{service.description}</p>
                    <p className="text-[13px] font-semibold mt-0.5" style={{ color: '#16A34A' }}>
                      ₱{Number(service.price).toLocaleString()}
                      {service.pricing_type === 'hourly' ? ' / hour' : ' fixed price'}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-text-secondary shrink-0" />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Reviews */}
        <Card>
          <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-3">
            Reviews
          </p>
          {!reviews || reviews.length === 0 ? (
            <div className="flex flex-col items-center text-center py-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={{ background: '#DCFCE7' }}
              >
                <Star size={26} color="#16A34A" strokeWidth={1.8} />
              </div>
              <p className="text-[15px] font-bold text-text-primary">Reviews</p>
              <p className="text-[13px] text-text-secondary mt-1">
                No reviews yet. Be the first to hire and leave feedback.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {reviews.map((review: any) => (
                <div key={review.id}>
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-bold text-text-primary">
                      {review.customer?.first_name} {review.customer?.last_name}
                    </p>
                    <p className="text-[12px] text-text-tertiary">{formatDate(review.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={13}
                        color="#D97706"
                        fill={i <= review.rating ? '#D97706' : 'none'}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  {review.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {review.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: 'var(--color-success-light)', color: '#16A34A' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {review.comment && (
                    <p className="text-[13.5px] text-text-secondary mt-2 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          <Link href={`/workers/${worker.id}/reviews`} className="w-full mt-4 block">
            <div
              className="w-full flex items-center justify-center gap-1.5 py-3 rounded-full"
              style={{ background: 'var(--color-bg-sunken)' }}
            >
              <span className="text-[13px] font-semibold text-text-primary">
                {reviewCount ? `View All ${reviewCount} Reviews` : 'View All Reviews'}
              </span>
              <ChevronRight size={15} className="text-text-secondary" />
            </div>
          </Link>
        </Card>

        {/* Gallery */}
        {photos && photos.length > 0 && (
          <Card>
            <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-3">
              Gallery
            </p>
            <div className="grid grid-cols-4 gap-2">
              {photos.map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={photo.id}
                  src={photo.photo_url}
                  alt=""
                  className="w-full aspect-square object-cover rounded-[10px]"
                />
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* CTA */}
      {!isOwnProfile && isVerified && (
        <div
          className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-3 pt-2"
          style={{ background: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}
        >
          <HireConfirmDialog workerId={worker.id} workerName={workerName} />
        </div>
      )}

      {!isOwnProfile && !isVerified && (
        <div
          className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-3 pt-2"
          style={{ background: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)' }}
        >
          <p className="text-[13px] text-text-secondary text-center py-3">
            This worker is not yet verified
          </p>
        </div>
      )}
    </div>
  )
}
