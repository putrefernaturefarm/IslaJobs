import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/more/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const { data: verification } = await supabase
    .from('verifications')
    .select('status')
    .eq('user_id', user.id)
    .single()

  const isNameLocked = verification?.status === 'approved'

  return <ProfileForm profile={profile} isNameLocked={isNameLocked} />
}
