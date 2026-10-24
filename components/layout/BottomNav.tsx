'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home, MessageCircle, CalendarCheck, Search, Briefcase, Users
} from 'lucide-react'
import type { UserRole } from '@/types/database'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

const workerNav: NavItem[] = [
  { href: '/home',     label: 'Home',     icon: Home },
  { href: '/chats',    label: 'Chats',    icon: MessageCircle },
  { href: '/jobs',     label: 'Jobs',     icon: Search },
  { href: '/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/services', label: 'Services', icon: Briefcase },
]

const customerNav: NavItem[] = [
  { href: '/home',     label: 'Home',     icon: Home },
  { href: '/chats',    label: 'Chats',    icon: MessageCircle },
  { href: '/workers',  label: 'Workers',  icon: Users },
  { href: '/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/jobs',     label: 'Jobs',     icon: Search },
]

interface BottomNavProps {
  role: UserRole
}

const CENTER_INDEX = 2

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname()
  const items = role === 'customer' ? customerNav : workerNav

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50"
      style={{
        background: 'color-mix(in srgb, var(--color-nav-bg) 92%, transparent)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--color-nav-border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-end justify-around h-16">
        {items.map((item, i) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const isCenter = i === CENTER_INDEX

          if (isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-end flex-1 h-full gap-1 relative"
              >
                <div
                  className="absolute -top-6 w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95"
                  style={{
                    background: isActive
                      ? 'var(--color-primary)'
                      : 'var(--color-bg-card)',
                    border: isActive ? 'none' : '2px solid var(--color-primary)',
                    boxShadow: isActive
                      ? '0 6px 16px color-mix(in srgb, var(--color-primary) 45%, transparent)'
                      : '0 4px 14px rgba(0,0,0,0.14)',
                  }}
                >
                  <Icon
                    size={25}
                    strokeWidth={2}
                    color={isActive ? '#fff' : 'var(--color-primary)'}
                  />
                </div>
                <span
                  className="text-[10px] font-semibold mb-1"
                  style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-nav-inactive)' }}
                >
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 relative"
            >
              {/* Active pill behind icon */}
              {isActive && (
                <span
                  className="absolute top-2.5 rounded-full"
                  style={{
                    width: 44,
                    height: 28,
                    background: 'var(--color-primary)',
                    opacity: 0.10,
                  }}
                />
              )}

              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                color={isActive ? 'var(--color-primary)' : 'var(--color-nav-inactive)'}
              />
              <span
                className="text-[10px] font-semibold"
                style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-nav-inactive)' }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
