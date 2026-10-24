import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { ChevronRight, LogOut, Repeat, Heart } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { Avatar } from '@/components/ui/Avatar'

type Tone = 'primary' | 'accent' | 'success' | 'violet' | 'sky' | 'danger' | 'pink'

const TONES: Record<Tone, { bg: string; fg: string }> = {
  primary: { bg: '#E7F0FD', fg: '#1565D8' },
  accent: { bg: '#FFF3E0', fg: '#D97706' },
  success: { bg: '#E6F7EC', fg: '#16A34A' },
  violet: { bg: '#EEF2FF', fg: '#4F46E5' },
  sky: { bg: '#F0F9FF', fg: '#0284C7' },
  danger: { bg: '#FFF1F2', fg: '#E11D48' },
  pink: { bg: '#FFF1F2', fg: '#E11D48' },
}

export default async function MorePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url, role, is_available')
    .eq('id', user.id)
    .single()

  const { data: verification } = await supabase
    .from('verifications')
    .select('status')
    .eq('user_id', user.id)
    .single()

  const verificationBadge =
    !verification || verification.status === 'not_submitted'
      ? 'Not submitted'
      : verification.status === 'pending'
      ? 'Under review'
      : verification.status === 'approved'
      ? 'Verified'
      : 'Rejected'

  const cookieStore = await cookies()
  const activeView = cookieStore.get('isla_view')?.value === 'customer' ? 'customer' : 'worker'
  const effectiveView = profile?.role === 'both' ? activeView : profile?.role
  const isWorker = effectiveView === 'worker'
  const isCustomer = effectiveView === 'customer'
  const accountLabel = isWorker ? 'Worker' : 'Customer'

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] pb-24">
      {/* Header */}
      <div className="bg-[var(--color-bg-card)] px-4 pt-6 pb-4 border-b border-[var(--color-border)]">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Account & support</h1>

        {/* Profile card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-bg-page)]">
          <Avatar
            src={profile?.profile_photo_url}
            firstName={profile?.first_name ?? ''}
            lastName={profile?.last_name ?? ''}
            size={56}
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[var(--color-text-primary)]">
              {profile?.first_name} {profile?.last_name}
            </p>
            <p className="text-sm text-[var(--color-text-secondary)]">{accountLabel} Account</p>
            <Link href="/more/profile" className="text-[13px] font-semibold text-[#1565D8] mt-0.5 inline-block">
              Edit Profile
            </Link>
          </div>
          <Link href="/more/profile">
            <ChevronRight size={20} className="text-[var(--color-text-secondary)]" />
          </Link>
        </div>
      </div>

      {/* Menu sections */}
      <div className="px-4 pt-4 space-y-4">
        {/* 1. Account */}
        <Section title="Account">
          {profile?.role === 'customer' && (
            <MenuItem
              href="/worker-setup?upgrade=1"
              icon={<Repeat className="w-5 h-5" />}
              tone="accent"
              label="Switch to Worker Account"
              description="Use the same account as Worker"
            />
          )}
          {profile?.role === 'worker' && (
            <MenuButtonItem
              target="customer"
              icon={<Repeat className="w-5 h-5" />}
              tone="accent"
              label="Switch to Customer Account"
              description="Use the same account as Customer"
            />
          )}
          {profile?.role === 'both' && (
            <MenuButtonItem
              target={activeView === 'worker' ? 'customer' : 'worker'}
              icon={<Repeat className="w-5 h-5" />}
              tone="accent"
              label={activeView === 'worker' ? 'Switch to Customer Account' : 'Switch to Worker Account'}
              description={`Currently viewing as ${activeView === 'worker' ? 'Worker' : 'Customer'}`}
            />
          )}
          <MenuItem
            href="/more/change-password"
            icon={<LockIcon />}
            tone="primary"
            label="Change Password"
            description="This updates the password used to sign in to IslaJobs"
          />
        </Section>

        {/* 2. Quick Links */}
        {isWorker && (
          <Section title="Quick Links">
            <MenuItem
              href={`/workers/${user.id}`}
              icon={<EyeIcon />}
              tone="accent"
              label="View public profile"
              description="See what customers see on your profile"
            />
            <MenuItem
              href="/more/booking-settings"
              icon={<SlidersIcon />}
              tone="primary"
              label="Booking Settings"
              description="Availability, radius, auto-accept"
            />
            <MenuItem
              href="/more/payout"
              icon={<WalletIcon />}
              tone="success"
              label="Payout Details"
              description="Manage your payout account"
            />
            <MenuItem
              href="/more/gallery"
              icon={<GalleryIcon />}
              tone="success"
              label="Gallery"
              description="Showcase your work with photos"
            />
            <MenuItem
              href="/more/credentials"
              icon={<AwardIcon />}
              tone="violet"
              label="Licenses & Credentials"
              description="Certificates, TESDA, and qualifications"
            />
            <MenuItem
              href="/more/verification"
              icon={<ShieldIcon />}
              tone="success"
              label="Verification"
              description="Verify your identity to get hired"
              badge={verificationBadge}
              badgeColor={
                verificationBadge === 'Verified'
                  ? 'green'
                  : verificationBadge === 'Under review'
                  ? 'yellow'
                  : verificationBadge === 'Rejected'
                  ? 'red'
                  : 'gray'
              }
            />
            <MenuItem
              href="/more/display"
              icon={<DisplayIcon />}
              tone="accent"
              label="Display"
              description="Choose your theme preference"
            />
          </Section>
        )}

        {isCustomer && (
          <Section title="Quick Links">
            <MenuItem
              href="/more/saved-workers"
              icon={<Heart className="w-5 h-5" />}
              tone="pink"
              label="Saved Workers"
              description="Workers you've hearted"
            />
            <MenuItem
              href="/more/display"
              icon={<DisplayIcon />}
              tone="accent"
              label="Display"
              description="Choose your theme preference"
            />
          </Section>
        )}

        {/* 3. Support */}
        <Section title="Support">
          <MenuItem
            href="/more/notifications"
            icon={<BellIcon />}
            tone="success"
            label="Notifications"
            description="Your activity notifications"
          />
          <MenuItem
            href="/more/help"
            icon={<HelpIcon />}
            tone="violet"
            label="Help & support"
            description="Get help or report an issue"
          />
          <MenuItem
            href="/more/announcements"
            icon={<RadioIcon />}
            tone="success"
            label="Announcements"
            description="News and updates from IslaJobs"
          />
        </Section>

        {/* 4. App Info */}
        <Section title="App Info">
          <MenuItem
            href="/more/about"
            icon={<InfoIcon />}
            tone="success"
            label="About IslaJobs"
            description="Version 1.0.0"
          />
          <MenuItem href="/privacy" icon={<DocIcon />} tone="success" label="Privacy Policy" />
          <MenuItem href="/terms" icon={<DocIcon />} tone="primary" label="Terms of Service" />
        </Section>

        {/* 5. Danger Zone */}
        <Section title="Danger Zone">
          <MenuItem
            href="/more/delete-account"
            icon={<TrashIcon />}
            tone="danger"
            label="Delete Account"
            description="Permanently remove your account and data"
          />
        </Section>

        {/* 6. Sign Out */}
        <SignOutButton />
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title?: string
  children: React.ReactNode
}) {
  return (
    <div>
      {title && (
        <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide px-1 mb-2">
          {title}
        </p>
      )}
      <div className="bg-[var(--color-bg-card)] rounded-2xl overflow-hidden divide-y divide-[var(--color-border)]">
        {children}
      </div>
    </div>
  )
}

function MenuItem({
  href,
  icon,
  label,
  description,
  badge,
  badgeColor = 'gray',
  tone = 'primary',
}: {
  href: string
  icon: React.ReactNode
  label: string
  description?: string
  badge?: string
  badgeColor?: 'green' | 'yellow' | 'red' | 'gray'
  tone?: Tone
}) {
  const badgeColors = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-[var(--color-bg-sunken)] text-[var(--color-text-secondary)]',
  }
  const colors = TONES[tone]
  const isDanger = tone === 'danger'

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-[var(--color-bg-page)] active:bg-[var(--color-bg-sunken)] transition-colors"
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: colors.bg }}>
        <span style={{ color: colors.fg }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: isDanger ? colors.fg : 'var(--color-text-primary)' }}>{label}</p>
        {description && <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{description}</p>}
      </div>
      {badge && (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColors[badgeColor]}`}>
          {badge}
        </span>
      )}
      {!badge && <ChevronRight size={16} className="text-[var(--color-text-secondary)]" />}
    </Link>
  )
}

function MenuButtonItem({
  target,
  icon,
  label,
  description,
  tone = 'primary',
}: {
  target: 'customer' | 'worker'
  icon: React.ReactNode
  label: string
  description?: string
  tone?: Tone
}) {
  const colors = TONES[tone]

  return (
    <form action="/api/account/switch-role" method="POST">
      <input type="hidden" name="target" value={target} />
      <button
        type="submit"
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[var(--color-bg-page)] active:bg-[var(--color-bg-sunken)] transition-colors"
      >
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: colors.bg }}>
          <span style={{ color: colors.fg }}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
          {description && <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{description}</p>}
        </div>
        <ChevronRight size={16} className="text-[var(--color-text-secondary)]" />
      </button>
    </form>
  )
}

function SignOutButton() {
  return (
    <form action="/api/auth/signout" method="POST">
      <button
        type="submit"
        className="w-full h-[52px] rounded-full flex items-center justify-center gap-2 text-[15px] font-semibold active:opacity-80 transition-opacity"
        style={{ background: TONES.primary.bg, color: TONES.primary.fg }}
      >
        <LogOut size={17} strokeWidth={2.2} />
        Sign Out
      </button>
    </form>
  )
}

// Icon components
function ShieldIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  )
}

function HelpIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}

function GalleryIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function AwardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="8" r="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14.5L7 22l5-3 5 3-2-7.5" />
    </svg>
  )
}

function DisplayIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  )
}

function RadioIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.5 8.5a5 5 0 000 7m7-7a5 5 0 010 7M6 6a9 9 0 000 12m12-12a9 9 0 010 12" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16" />
    </svg>
  )
}
