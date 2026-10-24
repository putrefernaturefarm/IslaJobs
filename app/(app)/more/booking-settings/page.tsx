import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import AvailabilityToggleClient from '@/components/more/AvailabilityToggleClient'
import BookingPreferencesForm from '@/components/more/BookingPreferencesForm'

export default async function BookingSettingsPage() {
  const supabase = await createServerClient()

  const { data: { user: authUser } } = await supabase.auth.getUser()
  if (!authUser) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single()

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Booking Settings" />

      <div className="flex-1 pt-14 px-4 pb-6 space-y-4">
        <Card className="mt-5">
          <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-4">
            Work Status
          </p>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-1.5">
                Available for New Jobs
              </p>
              <p className="text-[13px] text-text-secondary leading-snug">
                Turn this on to receive new booking requests. You must be verified and have a verified phone number.
              </p>
            </div>
            <AvailabilityToggleClient userId={authUser.id} initialValue={profile?.is_available ?? false} />
          </div>
        </Card>

        <BookingPreferencesForm
          userId={authUser.id}
          initialRadiusKm={(profile as any)?.service_radius_km ?? 30}
          initialMaxActiveJobs={(profile as any)?.max_active_jobs ?? 3}
        />
      </div>
    </div>
  )
}
