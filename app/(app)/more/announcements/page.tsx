import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Radio } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import type { Announcement } from '@/types/database'

export default async function AnnouncementsPage() {
  const supabase = await createServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, body, published, created_at')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const list = (announcements ?? []) as Announcement[]

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Announcements" />

      <div className="flex-1 pt-14 px-4 pb-6">
        {list.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-16 px-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'var(--color-success-light)' }}
            >
              <Radio size={30} color="#16A34A" strokeWidth={1.8} />
            </div>
            <p className="text-[17px] font-bold text-text-primary">No announcements yet</p>
            <p className="text-[13px] text-text-secondary mt-2 max-w-[280px]">
              News and updates from the IslaJobs team will show up here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 mt-4">
            {list.map((a) => (
              <Link key={a.id} href={`/more/announcements/${a.id}`} className="card !rounded-[18px] block">
                <p className="text-[14px] font-bold text-text-primary">{a.title}</p>
                <p className="text-[13px] text-text-secondary mt-1 line-clamp-2">{a.body}</p>
                <p className="text-[11px] text-text-tertiary mt-1.5">{timeAgo(a.created_at)}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
