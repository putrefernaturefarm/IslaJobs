import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import AddPhotoForm from '@/components/more/AddPhotoForm'

export default async function AddPhotoPage() {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url')
    .eq('id', authUser.id)
    .single()

  if (!profile) redirect('/login')

  return <AddPhotoForm profile={profile} />
}
