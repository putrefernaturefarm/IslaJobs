import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import CredentialsClient from '@/components/more/CredentialsClient'

export default async function CredentialsPage() {
  const supabase = await createServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: credentials } = await supabase
    .from('credentials')
    .select('id, user_id, title, issuer, document_url, created_at')
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false })

  return <CredentialsClient userId={authUser.id} initialCredentials={credentials ?? []} />
}
