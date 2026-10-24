import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import PayoutForm from '@/components/more/PayoutForm'

export default async function PayoutPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Only workers need payout details
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'worker' && profile.role !== 'both')) {
    redirect('/more')
  }

  const { data: payout } = await supabase
    .from('payout_details')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return <PayoutForm userId={user.id} payout={payout ?? null} />
}
