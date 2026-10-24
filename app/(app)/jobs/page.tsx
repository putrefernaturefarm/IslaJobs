import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ClipboardList, Plus, Search } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string }
}) {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', authUser.id)
    .single()

  const cookieStore = await cookies()
  const activeView = cookieStore.get('isla_view')?.value === 'customer' ? 'customer' : 'worker'
  const effectiveRole = profile?.role === 'both' ? activeView : profile?.role

  const isCustomerView = effectiveRole === 'customer'

  let query = supabase
    .from('job_posts')
    .select(`*, categories(name, icon), users!customer_id(first_name, last_name)`)
    .order('created_at', { ascending: false })

  if (isCustomerView) {
    // Customers manage their own job posts here.
    query = query.eq('customer_id', authUser.id)
  } else {
    // Workers browse open job posts from everyone.
    query = query.eq('status', 'open')
  }

  if (searchParams.category) {
    query = query.eq('category_id', searchParams.category)
  }
  if (searchParams.q) {
    query = query.ilike('title', `%${searchParams.q}%`)
  }

  const { data: jobs } = await query.limit(50)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-bg-card z-30 px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[18px] font-bold text-text-primary">
            {isCustomerView ? 'My job posts' : 'Browse Jobs'}
          </h1>
          {isCustomerView && (
            <Link
              href="/jobs/post"
              aria-label="Post a job"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-primary"
            >
              <Plus size={18} color="#fff" strokeWidth={2.5} />
            </Link>
          )}
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <form>
            <input
              name="q"
              defaultValue={searchParams.q}
              placeholder={isCustomerView ? 'Search your job posts...' : 'Search jobs...'}
              className="input-field pl-10 !h-11"
            />
          </form>
        </div>
      </div>

      <div className="px-4 py-4">
        {!jobs || jobs.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title={isCustomerView ? 'No job posts yet' : 'No jobs found'}
            description={
              isCustomerView
                ? 'Create a job post to let nearby workers find and apply to your listing.'
                : 'Job posts from customers will appear here for workers to review and apply.'
            }
            primaryAction={
              isCustomerView
                ? { label: 'Post a job', href: '/jobs/post' }
                : { label: 'Browse Workers', href: '/workers' }
            }
            tone="success"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.map((job: any) => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <Card className="!p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-primary-light flex items-center justify-center shrink-0 text-[20px]">
                      {job.categories?.icon || '🔧'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-text-primary truncate">
                        {job.title}
                      </p>
                      <p className="text-[13px] text-text-secondary mt-0.5 truncate">
                        {job.categories?.name}
                      </p>
                      <p className="text-[12px] text-text-secondary mt-1 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[13px] font-semibold text-primary">
                          {job.pricing_type === 'negotiable'
                            ? 'Negotiable'
                            : job.budget_min
                            ? `${formatCurrency(job.budget_min)}${job.budget_max ? ` – ${formatCurrency(job.budget_max)}` : '+'}`
                            : 'Open budget'}
                        </span>
                        <span className="text-[11px] text-text-secondary">
                          {formatDate(job.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
