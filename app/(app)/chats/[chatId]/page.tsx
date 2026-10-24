import { notFound, redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import ChatRoom from '@/components/chats/ChatRoom'

interface Props {
  params: { chatId: string }
}

export default async function ChatRoomPage({ params }: Props) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: chat } = await supabase
    .from('chats')
    .select(`
      *,
      participant_1_user:users!chats_participant_1_fkey(
        id, first_name, last_name, profile_photo_url, role
      ),
      participant_2_user:users!chats_participant_2_fkey(
        id, first_name, last_name, profile_photo_url, role
      )
    `)
    .eq('id', params.chatId)
    .single()

  if (!chat) notFound()

  // Access control: only participants can view
  if (chat.participant_1 !== user.id && chat.participant_2 !== user.id) {
    redirect('/chats')
  }

  const isParticipant1 = chat.participant_1 === user.id
  const otherUser: any = isParticipant1
    ? chat.participant_2_user
    : chat.participant_1_user

  // Fetch initial messages (newest 50, reversed for display)
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', params.chatId)
    .order('created_at', { ascending: false })
    .limit(50)

  const initialMessages = (messages ?? []).reverse()

  // Mark unread messages from the other person as read
  const unreadIds = initialMessages
    .filter((m: any) => m.sender_id !== user.id && !m.read_at)
    .map((m: any) => m.id)

  if (unreadIds.length > 0) {
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .in('id', unreadIds)
  }

  return (
    <ChatRoom
      chatId={params.chatId}
      currentUserId={user.id}
      otherUser={otherUser}
      initialMessages={initialMessages}
    />
  )
}
