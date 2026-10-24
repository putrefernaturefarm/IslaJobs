import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/layout/BottomNav'
import type { UserRole } from '@/types/database'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()

  if (!authUser) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', authUser.id)
    .single()

  if (!profile) {
    redirect('/login')
  }

  // A 'both'-role account's bottom nav should reflect whichever side
  // they're currently viewing as, not their raw account capability.
  const cookieStore = await cookies()
  const activeView = cookieStore.get('isla_view')?.value === 'customer' ? 'customer' : 'worker'
  const role = (profile.role === 'both' ? activeView : profile.role) as UserRole

  return (
    <div className="relative min-h-screen bg-bg-page">
      <main className="page-content">
        {children}
      </main>
      <BottomNav role={role} />
    </div>
  )
}
