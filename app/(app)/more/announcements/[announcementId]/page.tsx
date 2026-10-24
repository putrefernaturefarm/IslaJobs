import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Inbox } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function AnnouncementDetailPage({
  params,
}: {
  params: { announcementId: string }
}) {
  const supabase = await createServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: announcement } = await supabase
    .from('announcements')
    .select('id, title, body, published, created_at')
    .eq('id', params.announcementId)
    .eq('published', true)
    .single()

  if (!announcement) {
    return (
      <div className="flex flex-col min-h-screen">
        <TopBar title="Announcement" />

        <div className="flex-1 pt-14 px-4 pb-6 flex flex-col items-center text-center justify-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'var(--color-success-light)' }}
          >
            <Inbox size={30} color="#16A34A" strokeWidth={1.8} />
          </div>
          <p className="text-[17px] font-bold text-text-primary">Announcement unavailable</p>
          <p className="text-[13px] text-text-secondary mt-2 max-w-[280px]">
            We couldn&apos;t load this announcement. It may have been removed or is no longer available.
          </p>
          <Link
            href="/home"
            className="mt-5 inline-flex items-center px-6 py-3 rounded-full text-[14px] font-semibold text-white bg-primary"
          >
            Go to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Announcement" />

      <div className="flex-1 pt-14 px-4 pb-6">
        <div className="card !rounded-[20px] mt-4">
          <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-2">
            {formatDate(announcement.created_at)}
          </p>
          <h1 className="text-[19px] font-bold text-text-primary leading-snug">{announcement.title}</h1>
          <p className="text-[14px] text-text-primary leading-relaxed mt-3 whitespace-pre-line">
            {announcement.body}
          </p>
        </div>
      </div>
    </div>
  )
}
