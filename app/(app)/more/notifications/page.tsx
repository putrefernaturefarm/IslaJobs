import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import NotificationsClient from '@/components/more/NotificationsClient'

export default async function NotificationsPage() {
  const supabase = await createServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return <NotificationsClient initialNotifications={notifications ?? []} />
}
