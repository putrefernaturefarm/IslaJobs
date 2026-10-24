'use client'

import { useState } from 'react'
import { Bell, Briefcase, MessageSquare, ShieldCheck, Info } from 'lucide-react'
import { createBrowserClient } from '@/lib/supabase/client'
import { TopBar } from '@/components/layout/TopBar'
import { timeAgo } from '@/lib/utils'
import type { Notification, NotificationType } from '@/types/database'

interface Props {
  initialNotifications: Notification[]
}

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  booking: Briefcase,
  message: MessageSquare,
  verification: ShieldCheck,
  system: Info,
}

export default function NotificationsClient({ initialNotifications }: Props) {
  const supabase = createBrowserClient()
  const [notifications, setNotifications] = useState(initialNotifications)

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    supabase.from('notifications').update({ read: true }).eq('id', id).then()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Notifications" />

      <div className="flex-1 pt-14 px-4 pb-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center text-center mt-16 px-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'var(--color-success-light)' }}
            >
              <Bell size={30} color="#16A34A" strokeWidth={1.8} />
            </div>
            <p className="text-[17px] font-bold text-text-primary">No notifications yet</p>
            <p className="text-[13px] text-text-secondary mt-2 max-w-[280px]">
              Booking updates, job alerts and messages will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            {notifications.map((n) => {
              const Icon = TYPE_ICON[n.type] ?? Bell
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => !n.read && markRead(n.id)}
                  className="card !rounded-[16px] flex items-start gap-3 text-left"
                  style={{ opacity: n.read ? 0.65 : 1 }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--color-success-light)' }}
                  >
                    <Icon size={16} color="#16A34A" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-text-primary">{n.title}</p>
                    <p className="text-[12.5px] text-text-secondary mt-0.5">{n.body}</p>
                    <p className="text-[11px] text-text-tertiary mt-1">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
