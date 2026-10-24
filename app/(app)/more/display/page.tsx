import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import ThemeToggleClient from '@/components/more/ThemeToggleClient'

export default async function DisplayPage() {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('theme_preference, dark_mode')
    .eq('id', authUser.id)
    .single()

  const initialPreference =
    (profile as any)?.theme_preference ?? (profile?.dark_mode ? 'dark' : 'light')

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Display" />

      <div className="flex-1 pt-14 px-4 pb-6">
        <div className="mt-5">
          <ThemeToggleClient userId={authUser.id} initialPreference={initialPreference} />
        </div>
      </div>
    </div>
  )
}
