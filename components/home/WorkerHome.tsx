'use client'
import Link from 'next/link'
import {
  Bell, Shield, Search, TrendingUp, CalendarCheck, Eye, MapPin,
  Sparkles, Wrench, Package, Hammer, PawPrint, ChefHat, MoreHorizontal,
  Star, Banknote, ClipboardList, CheckCircle2, Camera, PenLine, Check,
  Settings, Laptop, Flower2, Handshake, Plane,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { ThemeToggleIcon } from '@/components/more/ThemeToggleIcon'
import { AdCarousel } from '@/components/home/AdCarousel'
import type { User, Verification, Category } from '@/types/database'

interface Props {
  user: User
  verification: Verification | null
  categories: Category[]
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'hammer':          Hammer,
  'laptop':          Laptop,
  'flower-2':        Flower2,
  'handshake':       Handshake,
  'plane':           Plane,
  'sparkles':        Sparkles,
  'wrench':          Wrench,
  'package':         Package,
  'paw-print':       PawPrint,
  'chef-hat':        ChefHat,
  'more-horizontal': MoreHorizontal,
}

const CATEGORY_STYLES: Record<string, { gradient: string; shadow: string }> = {
  'hammer':          { gradient: 'linear-gradient(135deg, #1E3A8A 0%, #1565D8 60%, #2563EB 100%)', shadow: 'rgba(21,101,216,0.30)' },
  'laptop':          { gradient: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 60%, #818CF8 100%)', shadow: 'rgba(79,70,229,0.30)' },
  'flower-2':        { gradient: 'linear-gradient(135deg, #6D28D9 0%, #8B5CF6 60%, #C4B5FD 100%)', shadow: 'rgba(139,92,246,0.30)' },
  'handshake':       { gradient: 'linear-gradient(135deg, #1F2937 0%, #4B5563 60%, #9CA3AF 100%)', shadow: 'rgba(75,85,99,0.30)' },
  'plane':           { gradient: 'linear-gradient(135deg, #075985 0%, #0891B2 60%, #67E8F9 100%)', shadow: 'rgba(8,145,178,0.30)' },
  'sparkles':        { gradient: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 60%, #5EEAD4 100%)', shadow: 'rgba(20,184,166,0.30)' },
  'wrench':          { gradient: 'linear-gradient(135deg, #92400E 0%, #D97706 60%, #FBBF24 100%)', shadow: 'rgba(217,119,6,0.30)' },
  'package':         { gradient: 'linear-gradient(135deg, #C2410C 0%, #EA580C 60%, #FB923C 100%)', shadow: 'rgba(234,88,12,0.30)' },
  'paw-print':       { gradient: 'linear-gradient(135deg, #BE185D 0%, #E11D48 60%, #FB7185 100%)', shadow: 'rgba(225,29,72,0.30)' },
  'chef-hat':        { gradient: 'linear-gradient(135deg, #854D0E 0%, #CA8A04 60%, #FDE047 100%)', shadow: 'rgba(202,138,4,0.30)' },
  'more-horizontal': { gradient: 'linear-gradient(135deg, #44403C 0%, #78716C 60%, #A8A29E 100%)', shadow: 'rgba(120,113,108,0.30)' },
}

const QUICK_ACTIONS = [
  { bg: '#E7F0FD', bubble: '#1565D8', color: '#0E4DAE', Icon: CalendarCheck, label: 'My Bookings', desc: 'View your active and completed bookings', href: '/bookings' },
  { bg: '#F0F9FF', bubble: '#0284C7', color: '#0369A1', Icon: Search,        label: 'Browse Jobs', desc: 'Find job posts near you',                  href: '/jobs' },
  { bg: '#FFF3E0', bubble: '#D97706', color: '#B45309', Icon: TrendingUp,    label: 'Earnings',    desc: 'Track your income and payouts',            href: '/more/earnings' },
]


export function WorkerHome({ user, verification, categories }: Props) {
  const isVerified  = verification?.status === 'approved'
  const isPending   = verification?.status === 'pending'
  const needsVerify = !verification

  const missingPhoto    = !user.profile_photo_url
  const missingLocation = !user.location_lat || !user.location_lng
  const missingBio      = !user.bio
  const hasChecklistItems = missingPhoto || missingLocation || missingBio

  return (
    <div style={{ background: 'var(--color-bg-page)', minHeight: '100vh' }}>

      {/* ── TOP BAR ── */}
      <div
        className="sticky top-0 z-30 px-4 pt-4 pb-3 flex items-start justify-between"
        style={{ background: 'var(--color-bg-page)' }}
      >
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Avatar
              src={user.profile_photo_url}
              firstName={user.first_name}
              lastName={user.last_name}
              size={46}
            />
            {isVerified && (
              <span
                className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center border-2"
                style={{ background: '#16A34A', borderColor: 'var(--color-bg-page)' }}
              >
                <Check size={9} color="#fff" strokeWidth={3} />
              </span>
            )}
          </div>
          <div>
            <p className="text-[18px] font-bold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
              Hi, {user.first_name} 👋
            </p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full"
                style={{ background: 'var(--color-bg-sunken)' }}
              >
                <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Worker</span>
              </span>
              {isVerified ? (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full"
                  style={{ background: '#DCFCE7' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#16A34A' }} />
                  <span className="text-[11px] font-semibold" style={{ color: '#15803D' }}>Available</span>
                </span>
              ) : isPending ? (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full"
                  style={{ background: '#EEF2FF' }}
                >
                  <span className="text-[11px] font-semibold" style={{ color: '#4F46E5' }}>⏳ Under Review</span>
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full"
                  style={{ background: '#FEF3C7' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#D97706' }} />
                  <span className="text-[11px] font-semibold" style={{ color: '#B45309' }}>Set up profile</span>
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Link href="/more">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-bg-card)', boxShadow: '0 2px 12px rgba(0,0,0,0.11)' }}
            >
              <Settings size={19} color="var(--color-text-primary)" />
            </div>
          </Link>
          <Link href="/more/notifications">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center relative"
              style={{ background: 'var(--color-bg-card)', boxShadow: '0 2px 12px rgba(0,0,0,0.11)' }}
            >
              <Bell size={19} color="var(--color-text-primary)" />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: '#EF4444', border: '1.5px solid var(--color-bg-card)' }}
              />
            </div>
          </Link>
          <ThemeToggleIcon userId={user.id} initialDarkMode={user.dark_mode} size={40} iconSize={19} />
        </div>
      </div>

      <div className="px-4 pt-1 pb-24 flex flex-col gap-4">

        {/* ── SEARCH BAR ── */}
        <div
          className="flex items-center gap-2.5 px-4 py-3.5 rounded-[50px]"
          style={{ background: 'var(--color-bg-card)', boxShadow: '0 2px 14px rgba(0,0,0,0.08)' }}
        >
          <Search size={16} color="#9A9590" strokeWidth={2} />
          <span className="text-[14px]" style={{ color: '#C0BCB8' }}>Search for jobs near you...</span>
        </div>

        {/* ── FLASHY SERVICES AD CAROUSEL ── */}
        <AdCarousel />

        {/* ── COMPLETE YOUR PROFILE — only shows what's actually missing ── */}
        {hasChecklistItems && (
          <section className="flex flex-col gap-2.5">
            {missingPhoto && (
              <ChecklistCard
                Icon={Camera}
                color="#D97706"
                bg="#FFF3E0"
                border="#FDE1B0"
                title="Add a profile photo"
                desc="Build trust with customers by adding your photo"
                actionLabel="Add"
                href="/more/profile/photo"
              />
            )}
            {missingLocation && (
              <ChecklistCard
                Icon={MapPin}
                color="#16A34A"
                bg="#F0FDF4"
                border="#BBF7D0"
                title="Complete profile to appear in search"
                desc="Add location so nearby customers can find you, and distance is calculated correctly."
                actionLabel="Update"
                href="/more/profile"
              />
            )}
            {missingBio && (
              <ChecklistCard
                Icon={PenLine}
                color="#0284C7"
                bg="#F0F9FF"
                border="#BAE6FD"
                title="Add a short bio"
                desc="Tell customers about your skills and experience"
                actionLabel="Add"
                href="/more/profile"
              />
            )}
          </section>
        )}

        {/* ── VERIFICATION BANNER — needs verify ── */}
        {needsVerify && (
          <div
            className="w-full rounded-[20px] px-4 py-4 flex items-center gap-3 relative overflow-hidden"
            style={{ background: '#FFF1F2', border: '1.5px solid #FECDD3' }}
          >
            <span style={{ position: 'absolute', width: 90, height: 90, borderRadius: '50%', background: '#E11D48', opacity: 0.09, top: -20, right: -15, pointerEvents: 'none' }} />
            <span style={{ position: 'absolute', width: 50, height: 50, borderRadius: '50%', background: '#E11D48', opacity: 0.06, bottom: -10, right: 30, pointerEvents: 'none' }} />
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 relative z-10"
              style={{ background: '#fff', boxShadow: '0 2px 8px rgba(225,29,72,0.20)' }}
            >
              <Shield size={20} color="#E11D48" />
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#E11D48' }}>
                Action Required
              </p>
              <p className="font-bold text-[14px] leading-tight mt-0.5" style={{ color: '#1A1A1A' }}>
                Not Verified
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: '#9A9590' }}>
                Your account is not verified. Customers cannot book you until verification is approved.
              </p>
            </div>
            <Link href="/more/verification" className="relative z-10 shrink-0">
              <span
                className="inline-flex items-center px-4 py-2 rounded-full text-[12px] font-semibold text-white"
                style={{ background: '#E11D48' }}
              >
                Verify
              </span>
            </Link>
          </div>
        )}

        {/* ── VERIFICATION BANNER — pending ── */}
        {isPending && (
          <div
            className="w-full rounded-[20px] px-4 py-4 flex items-center gap-3 relative overflow-hidden"
            style={{ background: '#EEF2FF', border: '1.5px solid #C7D2FE' }}
          >
            <span style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: '#4F46E5', opacity: 0.09, top: -20, right: -10, pointerEvents: 'none' }} />
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 relative z-10"
              style={{ background: '#fff', boxShadow: '0 2px 8px rgba(79,70,229,0.18)' }}
            >
              <Shield size={20} color="#4F46E5" />
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#4F46E5' }}>
                Verification Pending
              </p>
              <p className="font-bold text-[14px] leading-tight mt-0.5" style={{ color: '#1A1A1A' }}>
                Under Review
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: '#6366F1' }}>
                We&apos;re reviewing your documents · 1–2 days
              </p>
            </div>
          </div>
        )}

        {/* ── VERIFIED BANNER ── */}
        {isVerified && (
          <div
            className="w-full rounded-[20px] px-4 py-4 flex items-center gap-3 relative overflow-hidden"
            style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}
          >
            <span style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: '#16A34A', opacity: 0.08, top: -20, right: -10, pointerEvents: 'none' }} />
            <div
              className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 relative z-10"
              style={{ background: '#fff', boxShadow: '0 2px 8px rgba(22,163,74,0.18)' }}
            >
              <CheckCircle2 size={20} color="#16A34A" />
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#16A34A' }}>
                Verified Worker
              </p>
              <p className="font-bold text-[14px] leading-tight mt-0.5" style={{ color: '#1A1A1A' }}>
                Your account is active
              </p>
              <p className="text-[12px] mt-0.5" style={{ color: '#16A34A' }}>
                You can apply to any job posting
              </p>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[11px] font-bold relative z-10"
              style={{ background: '#16A34A', color: '#fff' }}
            >
              ✓ Active
            </span>
          </div>
        )}

        {/* ── VISIBILITY STATUS BANNER ── */}
        {isVerified && (
          <div
            className="w-full rounded-[18px] px-4 py-3.5 flex items-center gap-3 relative overflow-hidden"
            style={{ background: user.is_available ? '#E7F0FD' : '#ECE8E0' }}
          >
            <span style={{ position: 'absolute', width: 70, height: 70, borderRadius: '50%', background: user.is_available ? '#1565D8' : '#9A9590', opacity: 0.08, top: -18, left: -18, pointerEvents: 'none' }} />
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10"
              style={{ background: '#fff' }}
            >
              <Eye size={16} color={user.is_available ? '#1565D8' : '#9A9590'} strokeWidth={2} />
            </div>
            <div className="relative z-10">
              <p className="text-[13px] font-bold leading-tight" style={{ color: user.is_available ? '#1565D8' : '#6B6560' }}>
                {user.is_available ? 'Visible to customers' : 'Hidden from customers'}
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: user.is_available ? '#1565D8' : '#9A9590', opacity: 0.85 }}>
                {user.is_available
                  ? 'Customers near you can find you in Nearby workers and search.'
                  : 'Turn on availability in More to appear in search again.'}
              </p>
            </div>
          </div>
        )}

        {/* ── QUICK ACTIONS 3-COL ── */}
        <div className="grid grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const ActionIcon = action.Icon
            return (
              <Link key={action.href} href={action.href}>
                <div
                  className="flex flex-col items-start justify-start py-3.5 px-3 rounded-[20px] gap-2 active:opacity-80 relative overflow-hidden"
                  style={{ background: action.bg, minHeight: 112 }}
                >
                  <span style={{ position: 'absolute', width: 72, height: 72, borderRadius: '50%', background: action.bubble, opacity: 0.15, top: -18, right: -18, pointerEvents: 'none' }} />
                  <span style={{ position: 'absolute', width: 44, height: 44, borderRadius: '50%', background: action.bubble, opacity: 0.09, bottom: -10, left: -12, pointerEvents: 'none' }} />
                  <div
                    className="w-9 h-9 rounded-[12px] flex items-center justify-center relative z-10"
                    style={{ background: '#fff', boxShadow: '0 3px 10px rgba(0,0,0,0.12)' }}
                  >
                    <ActionIcon size={17} color={action.color} strokeWidth={1.8} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[12px] font-bold leading-tight" style={{ color: action.color }}>
                      {action.label}
                    </p>
                    <p className="text-[10px] leading-snug mt-0.5 line-clamp-2" style={{ color: action.color, opacity: 0.75 }}>
                      {action.desc}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* ── STATS ── (verified workers only) */}
        {isVerified && (
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: 'Total Jobs', value: '0',  Icon: ClipboardList, color: '#4F46E5', bg: '#E0E7FF', bubble: '#4F46E5' },
              { label: 'Earnings',   value: '₱0', Icon: Banknote,      color: '#16A34A', bg: '#DCFCE7', bubble: '#16A34A' },
              { label: 'Rating',     value: '—',  Icon: Star,          color: '#D97706', bg: '#FEF3C7', bubble: '#D97706' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 py-4 rounded-[20px] relative overflow-hidden"
                style={{ background: stat.bg }}
              >
                <span style={{ position: 'absolute', width: 62, height: 62, borderRadius: '50%', background: stat.bubble, opacity: 0.12, top: -15, right: -12, pointerEvents: 'none' }} />
                <div
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center relative z-10"
                  style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                >
                  <stat.Icon size={17} color={stat.color} strokeWidth={1.8} />
                </div>
                <div className="text-center relative z-10">
                  <p className="text-[18px] font-bold leading-tight" style={{ color: '#1A1A1A' }}>{stat.value}</p>
                  <p className="text-[10px] font-semibold" style={{ color: stat.color }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-text-tertiary)' }}>
                  Categories
                </p>
                <p className="text-[18px] font-bold leading-tight mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
                  What are you good at?
                </p>
              </div>
              <Link href="/jobs" className="text-[12px] font-semibold mb-0.5" style={{ color: '#1565D8' }}>
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {categories.slice(0, 8).map((cat) => {
                const Icon   = CATEGORY_ICONS[cat.icon_name] ?? Wrench
                const styles = CATEGORY_STYLES[cat.icon_name] ?? CATEGORY_STYLES['more-horizontal']
                return (
                  <Link key={cat.id} href={`/jobs?category=${cat.id}`}>
                    <div
                      className="flex flex-col items-center gap-2 py-3.5 px-1 rounded-[20px] active:scale-95 transition-transform duration-150 relative overflow-hidden"
                      style={{ background: styles.gradient, boxShadow: `0 8px 18px ${styles.shadow}`, minHeight: 88 }}
                    >
                      <span style={{ position: 'absolute', width: 60, height: 54, background: 'rgba(255,255,255,0.12)', borderRadius: '50% 40% 60% 50% / 50% 60% 40% 50%', top: -16, right: -16, pointerEvents: 'none' }} />
                      <div
                        className="w-10 h-10 rounded-[12px] flex items-center justify-center relative z-10"
                        style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)' }}
                      >
                        <Icon size={18} color="#fff" strokeWidth={2} />
                      </div>
                      <span className="text-[10.5px] font-bold text-center leading-tight px-0.5 relative z-10 text-white">
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ── ACTIVE BOOKINGS EMPTY STATE ── */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-text-tertiary)' }}>
                Activity
              </p>
              <p className="text-[18px] font-bold mt-0.5" style={{ color: 'var(--color-text-primary)' }}>Active Bookings</p>
            </div>
            <Link href="/bookings" className="text-[12px] font-semibold mb-0.5" style={{ color: '#1565D8' }}>
              See all →
            </Link>
          </div>
          <div
            className="rounded-[24px] p-6 text-center relative overflow-hidden"
            style={{ background: 'var(--color-bg-card)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <span style={{ position: 'absolute', width: 130, height: 130, borderRadius: '50%', background: '#1565D8', opacity: 0.04, top: -35, right: -35, pointerEvents: 'none' }} />
            <span style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: '#1565D8', opacity: 0.03, bottom: -20, left: -20, pointerEvents: 'none' }} />
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 relative z-10"
              style={{ background: '#E7F0FD', boxShadow: '0 2px 12px rgba(21,101,216,0.14)' }}
            >
              <TrendingUp size={26} color="#1565D8" strokeWidth={1.6} />
            </div>
            <p className="text-[16px] font-bold relative z-10" style={{ color: 'var(--color-text-primary)' }}>
              No upcoming jobs for now
            </p>
            <p className="text-[13px] mt-1 mb-4 relative z-10" style={{ color: 'var(--color-text-tertiary)' }}>
              Keep services and gallery updated to attract more clients.
            </p>
            <div className="flex items-center justify-center gap-2.5 relative z-10">
              <Link href="/jobs">
                <div
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full active:opacity-80"
                  style={{ background: '#1565D8' }}
                >
                  <span className="text-[13px] font-semibold text-white">Browse Jobs</span>
                </div>
              </Link>
              <Link href="/bookings">
                <div
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full active:opacity-80"
                  style={{ background: 'var(--color-bg-sunken)' }}
                >
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>My Schedule</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

function ChecklistCard({
  Icon,
  color,
  bg,
  border,
  title,
  desc,
  actionLabel,
  href,
}: {
  Icon: LucideIcon
  color: string
  bg: string
  border: string
  title: string
  desc: string
  actionLabel: string
  href: string
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-4 rounded-[20px] relative overflow-hidden"
      style={{ background: bg, border: `1.5px solid ${border}` }}
    >
      <div
        className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0 relative z-10"
        style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
      >
        <Icon size={18} color={color} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0 relative z-10">
        <p className="text-[13px] font-bold leading-tight" style={{ color: '#1A1A1A' }}>
          {title}
        </p>
        <p className="text-[12px] mt-0.5 leading-snug" style={{ color: '#6B6560' }}>
          {desc}
        </p>
      </div>
      <Link href={href} className="shrink-0 relative z-10">
        <span
          className="inline-flex items-center px-4 py-2 rounded-full text-[12px] font-semibold text-white"
          style={{ background: color }}
        >
          {actionLabel}
        </span>
      </Link>
    </div>
  )
}
