import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Star } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function WorkerReviewsPage({
  params,
}: {
  params: { workerId: string }
}) {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: worker } = await supabase
    .from('users')
    .select('first_name, last_name')
    .eq('id', params.workerId)
    .single()

  if (!worker) notFound()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, customer:users!customer_id(first_name, last_name)')
    .eq('worker_id', params.workerId)
    .order('created_at', { ascending: false })

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="Reviews" />

        <div className="flex-1 pt-14 px-4 pb-6 flex flex-col items-center justify-center text-center gap-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: '#DCFCE7' }}
          >
            <Star size={26} color="#16A34A" strokeWidth={1.8} />
          </div>
          <p className="text-[15px] font-bold text-text-primary">No reviews yet</p>
          <p className="text-[13px] text-text-secondary max-w-[260px]">
            {worker.first_name} hasn&apos;t received any reviews yet. Be the first to hire and leave feedback.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title={`${reviews.length} Reviews`} />

      <div className="flex-1 pt-14 px-4 pb-6 space-y-3">
        {reviews.map((review: any) => (
          <Card key={review.id}>
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
                  size={14}
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
              <p className="text-[13.5px] text-text-secondary mt-2 leading-relaxed">{review.comment}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
