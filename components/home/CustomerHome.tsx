'use client'
import Link from 'next/link'
import {
  Bell, Plus, Users, CalendarClock, Search,
  Sparkles, Wrench, Package, Hammer, PawPrint, ChefHat, MoreHorizontal,
  ClipboardList, CheckCircle2, Settings, Laptop, Flower2, Handshake, Plane,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { ThemeToggleIcon } from '@/components/more/ThemeToggleIcon'
import { AdCarousel } from '@/components/home/AdCarousel'
import type { User, Category } from '@/types/database'

interface Props {
  user: User
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
  { bg: '#DCFCE7', bubble: '#16A34A', color: '#15803D', Icon: Plus,          label: 'Post\na Job',  href: '/jobs/post' },
  { bg: '#E0E7FF', bubble: '#4F46E5', color: '#3730A3', Icon: Search,        label: 'Workers',      href: '/workers' },
  { bg: '#FEF3C7', bubble: '#D97706', color: '#92400E', Icon: CalendarClock, label: 'My\nBookings', href: '/bookings' },
]

const HOW_IT_WORKS = [
  { Icon: ClipboardList, color: '#4F46E5', bg: '#EEF2FF', bubble: '#4F46E5', step: '1', title: 'Post a Job',    desc: 'Describe what you need done' },
  { Icon: Users,         color: '#0284C7', bg: '#F0F9FF', bubble: '#0284C7', step: '2', title: 'Workers Apply', desc: 'Verified locals reach out to you' },
  { Icon: CheckCircle2,  color: '#16A34A', bg: '#F0FDF4', bubble: '#16A34A', step: '3', title: 'Book & Pay',    desc: 'Confirm, meet, and pay securely' },
]

export function CustomerHome({ user, categories }: Props) {
  const firstName = user.first_name ?? 'there'

  return (
    <div style={{ background: 'var(--color-bg-page)', minHeight: '100vh' }}>

      {/* ─── Top Bar ─────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--color-bg-page)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <Avatar
            src={user.profile_photo_url}
            firstName={user.first_name}
            lastName={user.last_name}
            size={38}
          />
          <div>
            <p className="text-[17px] font-bold leading-tight" style={{ color: 'var(--color-text-primary)' }}>
              Hi, {firstName} 👋
            </p>
            <p className="text-[11px] font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
              Find skilled workers near you
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider"
            style={{ background: '#EEF2FF', color: '#4F46E5' }}
          >
            CUSTOMER
          </span>
          <Link href="/more">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: 'var(--color-bg-card)', boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}
            >
              <Settings size={18} color="var(--color-text-primary)" strokeWidth={1.8} />
            </div>
          </Link>
          <Link href="/more/notifications">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center relative"
              style={{ background: 'var(--color-bg-card)', boxShadow: '0 2px 10px rgba(0,0,0,0.10)' }}
            >
              <Bell size={18} color="var(--color-text-primary)" strokeWidth={1.8} />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: '#EF4444' }}
              />
            </div>
          </Link>
          <ThemeToggleIcon userId={user.id} initialDarkMode={user.dark_mode} />
        </div>
      </div>

      <div className="px-4 pt-3 pb-24 flex flex-col gap-5">

        {/* ─── Search Bar ──────────────────────────────────────── */}
        <Link href="/workers">
          <div
            className="flex items-center gap-3 px-4 h-[48px] rounded-full active:opacity-80"
            style={{ background: 'var(--color-bg-card)', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
          >
            <Search size={17} color="#9A9590" strokeWidth={2} />
            <span className="text-[14px]" style={{ color: '#B0ACA8' }}>
              Search for workers near you...
            </span>
          </div>
        </Link>

        {/* ─── Flashy Services Ad Carousel ─────────────────────── */}
        <AdCarousel />

        {/* ─── Quick Actions ─────────────────────────────────────── */}
        <section>
          <p className="text-[11px] font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
            QUICK ACCESS
          </p>
          <div className="grid grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((action) => {
              const ActionIcon = action.Icon
              return (
                <Link key={action.href} href={action.href}>
                  <div
                    className="flex flex-col items-center gap-2 pt-4 pb-3.5 rounded-[20px] relative overflow-hidden active:opacity-80"
                    style={{ background: action.bg, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                  >
                    {/* Ghost circles */}
                    <span style={{
                      position: 'absolute', width: 72, height: 72, borderRadius: '50%',
                      background: action.bubble, opacity: 0.12,
                      top: -18, right: -18, pointerEvents: 'none',
                    }} />
                    <span style={{
                      position: 'absolute', width: 44, height: 44, borderRadius: '50%',
                      background: action.bubble, opacity: 0.08,
                      bottom: -10, left: -12, pointerEvents: 'none',
                    }} />
                    {/* White icon bubble */}
                    <div
                      className="w-11 h-11 rounded-[14px] flex items-center justify-center relative z-10"
                      style={{ background: '#fff', boxShadow: '0 3px 10px rgba(0,0,0,0.12)' }}
                    >
                      <ActionIcon size={20} color={action.color} strokeWidth={1.8} />
                    </div>
                    <span
                      className="text-[11px] font-bold text-center leading-tight relative z-10 whitespace-pre-line px-1"
                      style={{ color: action.color }}
                    >
                      {action.label}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ─── Categories ────────────────────────────────────────── */}
        {categories.length > 0 && (
          <section>
            <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
              CATEGORIES
            </p>
            <div className="flex items-end justify-between mb-3">
              <p className="text-[20px] font-black leading-tight" style={{ color: 'var(--color-text-primary)' }}>
                Find the right worker
              </p>
              <Link href="/workers" className="text-[13px] font-semibold" style={{ color: '#1565D8' }}>
                All →
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {categories.slice(0, 8).map((cat) => {
                const Icon = CATEGORY_ICONS[cat.icon_name] ?? Wrench
                const style = CATEGORY_STYLES[cat.icon_name] ?? CATEGORY_STYLES['more-horizontal']
                return (
                  <Link key={cat.id} href={`/workers?category=${cat.id}`}>
                    <div
                      className="flex flex-col items-center gap-2 pt-3.5 pb-3 rounded-[20px] relative overflow-hidden active:scale-95 transition-transform duration-150"
                      style={{ background: style.gradient, boxShadow: `0 8px 18px ${style.shadow}` }}
                    >
                      {/* Ghost blob */}
                      <span style={{
                        position: 'absolute', width: 56, height: 50,
                        background: 'rgba(255,255,255,0.12)',
                        borderRadius: '50% 40% 60% 50% / 50% 60% 40% 50%',
                        top: -14, right: -14, pointerEvents: 'none',
                      }} />
                      {/* Frosted icon bubble */}
                      <div
                        className="w-10 h-10 rounded-[12px] flex items-center justify-center relative z-10"
                        style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)' }}
                      >
                        <Icon size={18} color="#fff" strokeWidth={2} />
                      </div>
                      <span className="text-[9.5px] font-bold text-center leading-tight px-1 relative z-10 text-white">
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* ─── How It Works ──────────────────────────────────────── */}
        <section>
          <p className="text-[11px] font-bold tracking-widest uppercase mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
            HOW IT WORKS
          </p>
          <p className="text-[20px] font-black leading-tight mb-3" style={{ color: 'var(--color-text-primary)' }}>
            Three easy steps
          </p>
          <div className="flex flex-col gap-3">
            {HOW_IT_WORKS.map((item) => {
              const StepIcon = item.Icon
              return (
                <div
                  key={item.step}
                  className="flex items-center gap-3.5 px-4 py-4 rounded-[20px] relative overflow-hidden"
                  style={{ background: item.bg, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}
                >
                  {/* Ghost circles */}
                  <span style={{
                    position: 'absolute', width: 80, height: 80, borderRadius: '50%',
                    background: item.bubble, opacity: 0.10,
                    top: -20, right: -20, pointerEvents: 'none',
                  }} />
                  <span style={{
                    position: 'absolute', width: 40, height: 40, borderRadius: '50%',
                    background: item.bubble, opacity: 0.07,
                    bottom: -10, right: 62, pointerEvents: 'none',
                  }} />

                  {/* White icon bubble */}
                  <div
                    className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 relative z-10"
                    style={{ background: '#fff', boxShadow: '0 3px 10px rgba(0,0,0,0.10)' }}
                  >
                    <StepIcon size={22} color={item.color} strokeWidth={1.8} />
                  </div>

                  <div className="flex-1 relative z-10">
                    <p className="text-[15px] font-bold" style={{ color: '#1A1A1A' }}>{item.title}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: '#6B6560' }}>{item.desc}</p>
                  </div>

                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-black shrink-0 relative z-10"
                    style={{ background: '#fff', color: item.color, boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}
                  >
                    {item.step}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ─── Active Bookings — empty state ─────────────────────── */}
        <section>
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--color-text-tertiary)' }}>
                Activity
              </p>
              <p className="text-[18px] font-bold mt-0.5" style={{ color: 'var(--color-text-primary)' }}>
                Active Bookings
              </p>
            </div>
            <Link href="/bookings" className="text-[12px] font-semibold mb-0.5" style={{ color: '#1565D8' }}>
              See all →
            </Link>
          </div>

          <div
            className="rounded-[24px] p-6 text-center relative overflow-hidden"
            style={{ background: 'var(--color-bg-card)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
          >
            <span style={{ position: 'absolute', width: 130, height: 130, borderRadius: '50%', background: '#16A34A', opacity: 0.05, top: -35, right: -35, pointerEvents: 'none' }} />
            <span style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: '#16A34A', opacity: 0.04, bottom: -20, left: -20, pointerEvents: 'none' }} />
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 relative z-10"
              style={{ background: 'var(--color-success-light)', boxShadow: '0 2px 12px rgba(22,163,74,0.14)' }}
            >
              <CalendarClock size={26} color="#16A34A" strokeWidth={1.6} />
            </div>
            <p className="text-[16px] font-bold relative z-10" style={{ color: 'var(--color-text-primary)' }}>
              You have no active bookings.
            </p>
            <p className="text-[13px] mt-1 mb-4 relative z-10" style={{ color: 'var(--color-text-tertiary)' }}>
              Hire a worker and your bookings will show up here.
            </p>
            <Link href="/workers" className="relative z-10">
              <div
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full active:opacity-80 bg-primary"
              >
                <span className="text-[14px] font-bold text-white">Hire a Worker</span>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
