import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import HelpSupportForm from '@/components/more/HelpSupportForm'

export default async function HelpSupportPage() {
  const supabase = await createServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('first_name, last_name, phone, email')
    .eq('id', authUser.id)
    .single()

  if (!profile) redirect('/login')

  return (
    <HelpSupportForm
      userId={authUser.id}
      fullName={`${profile.first_name} ${profile.last_name}`}
      phone={profile.phone}
      initialEmail={profile.email ?? ''}
    />
  )
}
