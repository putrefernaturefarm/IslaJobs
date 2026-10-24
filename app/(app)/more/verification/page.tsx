import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import VerificationForm from '@/components/more/VerificationForm'

export default async function VerificationPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: verification } = await supabase
    .from('verifications')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return <VerificationForm userId={user.id} verification={verification ?? null} />
}
