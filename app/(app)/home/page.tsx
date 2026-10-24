import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/supabase/server'
import { WorkerHome } from '@/components/home/WorkerHome'
import { CustomerHome } from '@/components/home/CustomerHome'

export default async function HomePage() {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  if (!profile) redirect('/login')

  const { data: verification } = await supabase
    .from('verifications')
    .select('*')
    .eq('user_id', authUser.id)
    .single()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  // role === 'both' can switch between dashboards; the choice persists in a cookie.
  // A single-role account always sees its own dashboard regardless of the cookie.
  const cookieStore = await cookies()
  const activeView = cookieStore.get('isla_view')?.value

  const showWorkerHome =
    profile.role === 'worker' || (profile.role === 'both' && activeView !== 'customer')

  if (showWorkerHome) {
    return (
      <WorkerHome
        user={profile}
        verification={verification}
        categories={categories ?? []}
      />
    )
  }

  return (
    <CustomerHome
      user={profile}
      categories={categories ?? []}
    />
  )
}
