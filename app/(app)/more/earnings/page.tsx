import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { EmptyState } from '@/components/ui/EmptyState'
import { Banknote, CheckCircle2, Clock } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

export default async function EarningsPage() {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: bookings } = await supabase
    .from('bookings')
    .select(`id, status, created_at, job_posts(title, budget_min, budget_max, pricing_type)`)
    .eq('worker_id', authUser.id)
    .order('created_at', { ascending: false })
    .limit(100)

  const all = bookings ?? []
  const completed = all.filter((b: any) => b.status === 'completed')
  const pending = all.filter((b: any) => b.status === 'pending' || b.status === 'accepted')

  const totalEarned = completed.reduce((sum: number, b: any) => {
    return sum + (b.job_posts?.budget_min ?? 0)
  }, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Earnings" />

      <div className="flex-1 pt-14 px-4 pb-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="card-elevated bg-white !rounded-[20px] flex flex-col gap-2" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="w-9 h-9 rounded-[12px] bg-primary-light flex items-center justify-center">
              <Banknote size={18} className="text-primary" strokeWidth={1.8} />
            </div>
            <p className="text-[20px] font-bold text-text-primary">{formatCurrency(totalEarned)}</p>
            <p className="text-[12px] text-text-secondary">Total earned</p>
          </div>
          <div className="card-elevated bg-white !rounded-[20px] flex flex-col gap-2" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="w-9 h-9 rounded-[12px] bg-accent-light flex items-center justify-center">
              <CheckCircle2 size={18} className="text-accent" strokeWidth={1.8} />
            </div>
            <p className="text-[20px] font-bold text-text-primary">{completed.length}</p>
            <p className="text-[12px] text-text-secondary">Completed jobs</p>
          </div>
        </div>

        {/* Completed bookings list */}
        <div className="mt-6">
          <p className="text-[11px] font-bold tracking-widest uppercase text-text-secondary mb-3">
            Payment History
          </p>

          {completed.length === 0 ? (
            <EmptyState
              icon={Banknote}
              title="No earnings yet"
              description="Completed and paid jobs will show up here."
              primaryAction={{ label: 'Browse Jobs', href: '/jobs' }}
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              {completed.map((b: any) => (
                <div key={b.id} className="card !rounded-[16px] flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-text-primary truncate">
                      {b.job_posts?.title ?? 'Direct Booking'}
                    </p>
                    <p className="text-[12px] text-text-secondary mt-0.5">{formatDate(b.created_at)}</p>
                  </div>
                  <span className="text-[14px] font-bold text-primary shrink-0 ml-3">
                    +{formatCurrency(b.job_posts?.budget_min ?? 0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {pending.length > 0 && (
          <div className="mt-6">
            <p className="text-[11px] font-bold tracking-widest uppercase text-text-secondary mb-3">
              In Progress
            </p>
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-[16px]" style={{ background: 'var(--color-accent-light)' }}>
              <Clock size={18} className="text-accent shrink-0" strokeWidth={1.8} />
              <p className="text-[13px] text-accent">
                {pending.length} booking{pending.length === 1 ? '' : 's'} not yet completed — earnings will appear once marked done.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
