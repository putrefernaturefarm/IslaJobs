import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import GalleryClient from '@/components/more/GalleryClient'

export default async function GalleryPage() {
  const supabase = await createServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: photos } = await supabase
    .from('worker_photos')
    .select('id, user_id, photo_url, created_at')
    .eq('user_id', authUser.id)
    .order('created_at', { ascending: false })

  return <GalleryClient userId={authUser.id} initialPhotos={photos ?? []} />
}
