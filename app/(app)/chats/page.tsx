import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import type { Chat, Message, User } from '@/types/database'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'

interface ChatWithMeta extends Chat {
  other_user: User
  last_message: Message | null
  unread_count: number
}

export default async function ChatsPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const cookieStore = await cookies()
  const activeView = cookieStore.get('isla_view')?.value === 'customer' ? 'customer' : 'worker'
  const displayAsWorker = profile?.role === 'both' ? activeView === 'worker' : profile?.role === 'worker'

  const { data: rawChats } = await supabase
    .from('chats')
    .select(`
      *,
      participant_1_user:users!chats_participant_1_fkey(
        id, first_name, last_name, profile_photo_url
      ),
      participant_2_user:users!chats_participant_2_fkey(
        id, first_name, last_name, profile_photo_url
      ),
      messages(
        id, chat_id, sender_id, content, read_at, created_at
      )
    `)
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order('created_at', { ascending: false })

  const chats: ChatWithMeta[] = (rawChats ?? []).map((chat: any) => {
    const isParticipant1 = chat.participant_1 === user.id
    const other_user: User = isParticipant1
      ? chat.participant_2_user
      : chat.participant_1_user

    const messages: Message[] = (chat.messages ?? []).sort(
      (a: Message, b: Message) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    const last_message = messages.length > 0 ? messages[0] : null

    const unread_count = messages.filter(
      (m: Message) => m.sender_id !== user.id && !m.read_at
    ).length

    return {
      ...chat,
      other_user,
      last_message,
      unread_count,
    }
  })

  // Sort by last message time
  chats.sort((a, b) => {
    const aTime = a.last_message
      ? new Date(a.last_message.created_at).getTime()
      : new Date(a.created_at).getTime()
    const bTime = b.last_message
      ? new Date(b.last_message.created_at).getTime()
      : new Date(b.created_at).getTime()
    return bTime - aTime
  })

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--color-bg-card)] border-b border-[var(--color-border)] px-4 py-4">
        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Messages</h1>
      </div>

      {chats.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="Inbox is empty"
          description={
            displayAsWorker
              ? 'Apply to jobs or accept a booking to start a conversation.'
              : 'Post a job or book a service to start a conversation.'
          }
          primaryAction={
            displayAsWorker
              ? { label: 'Browse Jobs', href: '/jobs' }
              : { label: 'Post a Job', href: '/jobs/post' }
          }
          tone="success"
        />
      ) : (
        <div className="bg-[var(--color-bg-card)] divide-y divide-[var(--color-border)]">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chats/${chat.id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-bg-page)] active:bg-[var(--color-bg-sunken)] transition-colors"
            >
              <div className="relative flex-shrink-0">
                <Avatar
                  src={chat.other_user?.profile_photo_url}
                  firstName={chat.other_user?.first_name ?? ''}
                  lastName={chat.other_user?.last_name ?? ''}
                  size={52}
                />
                {chat.unread_count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold flex items-center justify-center">
                    {chat.unread_count > 9 ? '9+' : chat.unread_count}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={`text-sm truncate ${chat.unread_count > 0 ? 'font-bold text-[var(--color-text-primary)]' : 'font-semibold text-[var(--color-text-primary)]'}`}>
                    {chat.other_user?.first_name} {chat.other_user?.last_name}
                  </p>
                  {chat.last_message && (
                    <span className="text-xs text-[var(--color-text-secondary)] flex-shrink-0 ml-2">
                      {formatTime(chat.last_message.created_at)}
                    </span>
                  )}
                </div>
                <p className={`text-sm truncate ${chat.unread_count > 0 ? 'font-semibold text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                  {chat.last_message
                    ? chat.last_message.sender_id === user.id
                      ? `You: ${chat.last_message.content}`
                      : chat.last_message.content
                    : 'No messages yet'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Bottom nav spacer */}
      <div className="h-20" />
    </div>
  )
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true })
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return date.toLocaleDateString('en-PH', { weekday: 'short' })
  } else {
    return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
  }
}
