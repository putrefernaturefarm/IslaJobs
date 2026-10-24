import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import HireWorkerForm from '@/components/workers/HireWorkerForm'

export default async function NewBookingPage({
  params,
}: {
  params: { workerId: string }
}) {
  const supabase = await createServerClient()
  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: worker } = await supabase
    .from('users')
    .select('id, first_name, last_name')
    .eq('id', params.workerId)
    .single()

  if (!worker) notFound()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('worker_id', worker.id)
    .order('created_at', { ascending: false })

  const workerName = `${worker.first_name} ${worker.last_name}`

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title={`Hire ${workerName}`} />

      <div className="flex-1 pt-14 px-4 pb-8">
        <HireWorkerForm
          workerId={worker.id}
          workerName={workerName}
          customerId={authUser.id}
          services={services ?? []}
        />
      </div>
    </div>
  )
}
