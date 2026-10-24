import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import EnableWorkerForm from '@/components/services/EnableWorkerForm'
import ServicesManager from '@/components/services/ServicesManager'

export default async function ServicesPage() {
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

  // Customers who have not yet enabled worker mode → show the enable form
  if (profile.role === 'customer') {
    return (
      <EnableWorkerForm
        userId={user.id}
        currentDob={profile.date_of_birth ?? null}
      />
    )
  }

  // Workers / both → show worker profile management hub
  const { data: verification } = await supabase
    .from('verifications')
    .select('status')
    .eq('user_id', user.id)
    .single()

  const { data: payout } = await supabase
    .from('payout_details')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('worker_id', user.id)
    .order('created_at', { ascending: false })

  const isVerified = verification?.status === 'approved'
  const hasPayout = Boolean(payout)

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      {/* Header */}
      <div className="bg-[var(--color-bg-card)] border-b border-[var(--color-border)] px-4 py-4">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">My Services</h1>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Status card */}
        <div className="bg-[var(--color-bg-card)] rounded-2xl px-4 py-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#E7F0FD] flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-[#1565D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-[var(--color-text-primary)]">
              {profile.first_name} {profile.last_name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  profile.is_available
                    ? 'bg-[#E7F0FD] text-[#1565D8]'
                    : 'bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)]'
                }`}
              >
                {profile.is_available ? 'Available' : 'Unavailable'}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  isVerified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {isVerified ? 'Verified ✓' : 'Unverified'}
              </span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {!isVerified && (
          <div className="bg-[#FFF1F2] rounded-2xl px-4 py-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-[#E11D48] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#E11D48] mb-0.5">Verification Required</p>
              <p className="text-xs text-[#6B6560]">
                Customers cannot book you until your account is verified.
              </p>
            </div>
            <Link
              href="/more/verification"
              className="flex-shrink-0 text-xs font-semibold text-white bg-[#E11D48] px-3 py-1.5 rounded-full"
            >
              Verify
            </Link>
          </div>
        )}

        {!hasPayout && (
          <div className="bg-[#FFF8E6] rounded-2xl px-4 py-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-[#E8A020] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 4h.01" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#E8A020] mb-0.5">No Payout Method</p>
              <p className="text-xs text-[#6B6560]">
                Add your GCash or Maya account to receive earnings.
              </p>
            </div>
            <Link
              href="/more/payout"
              className="flex-shrink-0 text-xs font-semibold text-white bg-[#E8A020] px-3 py-1.5 rounded-full"
            >
              Add
            </Link>
          </div>
        )}

        <ServicesManager workerId={user.id} initialServices={services ?? []} />

        {/* Quick actions */}
        <div className="bg-[var(--color-bg-card)] rounded-2xl divide-y divide-[var(--color-border)]">
          <p className="px-4 pt-4 pb-2 text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide">
            Profile Settings
          </p>

          <MenuRow
            href="/more/profile"
            icon={
              <svg className="w-5 h-5 text-[#1565D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            iconBg="bg-[#E7F0FD]"
            label="Edit Profile"
            sublabel="Name, bio, and location"
          />

          <MenuRow
            href="/more/verification"
            icon={
              <svg className="w-5 h-5 text-[#1565D8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            iconBg="bg-[#E7F0FD]"
            label="ID Verification"
            sublabel={isVerified ? 'Verified ✓' : verification?.status === 'pending' ? 'Under review' : 'Not submitted'}
          />

          <MenuRow
            href="/more/payout"
            icon={
              <svg className="w-5 h-5 text-[#1DA462]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M1 10h22" />
              </svg>
            }
            iconBg="bg-[#E6F4EA]"
            label="Payout Details"
            sublabel={hasPayout ? 'Configured' : 'Not set up'}
            last
          />
        </div>

        {/* Info */}
        <div className="bg-[#E7F0FD] rounded-2xl px-4 py-4">
          <p className="text-sm font-semibold text-[#1565D8] mb-1">How IslaJobs Works</p>
          <ul className="space-y-1">
            {[
              'Customers post jobs in your service area',
              'You apply or get booked directly',
              'Complete the job and receive payment within 24 hours',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-[#1565D8] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs text-[#1565D8]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function MenuRow({
  href,
  icon,
  iconBg,
  label,
  sublabel,
  last = false,
}: {
  href: string
  icon: React.ReactNode
  iconBg: string
  label: string
  sublabel: string
  last?: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3.5 active:bg-[var(--color-bg-page)] transition-colors ${last ? 'pb-4' : ''}`}
    >
      <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-[var(--color-text-primary)]">{label}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">{sublabel}</p>
      </div>
      <svg className="w-5 h-5 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}
