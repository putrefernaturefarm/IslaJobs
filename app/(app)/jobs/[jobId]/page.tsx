import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { MapPin, Clock, Banknote } from 'lucide-react'
import { ApplyJobButton } from '@/components/jobs/ApplyJobButton'

export default async function JobDetailPage({
  params,
}: {
  params: { jobId: string }
}) {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role, verifications(status)')
    .eq('id', authUser.id)
    .single()

  const { data: job } = await supabase
    .from('job_posts')
    .select(`*, categories(name, icon_name), users!customer_id(id, first_name, last_name, profile_photo_url)`)
    .eq('id', params.jobId)
    .single()

  if (!job) notFound()

  const isOwner = job.customer_id === authUser.id
  const isWorker = profile?.role === 'worker' || profile?.role === 'both'
  const verifications = (profile as any)?.verifications ?? []
  const isVerified = verifications.some((v: any) => v.status === 'approved')

  const budgetText = job.pricing_type === 'negotiable'
    ? 'Negotiable'
    : job.budget_max
    ? `Up to ${formatCurrency(job.budget_max)}`
    : 'Open budget'

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Job Details" />

      <div className="pt-14 px-4 pb-24">
        {/* Job header */}
        <div className="mt-4 mb-4">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-[12px] bg-[#E7F0FD] flex items-center justify-center shrink-0 text-[24px]">
              {job.categories?.icon_name || '🔧'}
            </div>
            <div className="flex-1">
              <h1 className="text-[20px] font-bold text-[#1A1A1A] leading-tight">
                {job.title}
              </h1>
              <p className="text-[14px] text-[#6B6560] mt-0.5">{job.categories?.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant={job.status === 'open' ? 'success' : 'neutral'}>
              {job.status === 'open' ? 'Open' : job.status}
            </Badge>
            <div className="flex items-center gap-1 text-[13px] text-[#6B6560]">
              <Clock size={13} />
              {formatDate(job.created_at)}
            </div>
          </div>
        </div>

        {/* Budget + location */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-3 p-3 bg-[#F0F7FF] rounded-[12px]">
            <Banknote size={20} color="#1565D8" />
            <div>
              <p className="text-[11px] text-[#6B6560]">Budget</p>
              <p className="text-[16px] font-bold text-[#1565D8]">{budgetText}</p>
              <p className="text-[11px] text-[#6B6560]">{job.pricing_type}</p>
            </div>
          </div>

          {job.address && (
            <div className="flex items-center gap-3 p-3 bg-white rounded-[12px] border border-[#ECE8E0]">
              <MapPin size={20} color="#6B6560" />
              <p className="text-[14px] text-[#1A1A1A]">{job.address}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <h2 className="section-heading mb-2">Job Description</h2>
          <p className="text-[14px] text-[#1A1A1A] leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </div>

        {/* Posted by */}
        <div className="mb-6">
          <h2 className="section-heading mb-2">Posted by</h2>
          <div className="flex items-center gap-3 p-4 bg-white rounded-[16px] border border-[#ECE8E0]">
            <Avatar
              src={job.users?.profile_photo_url}
              firstName={job.users?.first_name ?? '?'}
              lastName={job.users?.last_name ?? ''}
              size={44}
            />
            <div>
              <p className="text-[15px] font-semibold text-[#1A1A1A]">
                {job.users?.first_name} {job.users?.last_name}
              </p>
              <p className="text-[13px] text-[#6B6560]">Customer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action */}
      {!isOwner && isWorker && job.status === 'open' && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-3 bg-white border-t border-[#ECE8E0]">
          {isVerified ? (
            <ApplyJobButton jobId={job.id} workerId={authUser.id} />
          ) : (
            <div className="text-center py-2">
              <p className="text-[13px] text-[#6B6560] mb-2">
                You need to be verified to apply for jobs
              </p>
              <Link href="/more/verification">
                <Button variant="primary" fullWidth>
                  Get Verified
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {isOwner && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 pb-3 bg-white border-t border-[#ECE8E0]">
          <p className="text-[13px] text-[#6B6560] text-center py-2">This is your job posting</p>
        </div>
      )}
    </div>
  )
}
