import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { SaveWorkerButton } from '@/components/workers/SaveWorkerButton'
import { Heart, CheckCircle2 } from 'lucide-react'

export default async function SavedWorkersPage() {
  const supabase = await createServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: saved } = await supabase
    .from('saved_workers')
    .select('worker_id, users!worker_id(*, verifications(status))')
    .eq('customer_id', authUser.id)
    .order('created_at', { ascending: false })

  const workers = (saved ?? []).map((s: any) => s.users).filter(Boolean)

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Saved Workers" />

      <div className="flex-1 pt-14 px-4 pb-6">
        {workers.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              icon={Heart}
              title="No saved workers yet"
              description="Tap the heart on a worker's profile or listing to save them here."
              primaryAction={{ label: 'Browse Workers', href: '/workers' }}
              tone="success"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            {workers.map((worker: any) => {
              const isVerified = (worker.verifications ?? []).some((v: any) => v.status === 'approved')
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
                          <p className="text-[12px] text-text-secondary mt-0.5 line-clamp-1">{worker.bio}</p>
                        )}
                      </div>
                      <SaveWorkerButton customerId={authUser.id} workerId={worker.id} initialSaved />
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
