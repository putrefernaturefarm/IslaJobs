'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import type { Message } from '@/types/database'
import { Avatar } from '@/components/ui/Avatar'

interface OtherUser {
  id: string
  first_name: string
  last_name: string
  avatar_url?: string
  role?: string
}

interface Props {
  chatId: string
  currentUserId: string
  otherUser: OtherUser
  initialMessages: Message[]
}

export default function ChatRoom({
  chatId,
  currentUserId,
  otherUser,
  initialMessages,
}: Props) {
  const router = useRouter()
  const supabase = createBrowserClient()

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat-room-${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          // Only add if it's from the other person (our own messages are added optimistically)
          if (newMsg.sender_id !== currentUserId) {
            setMessages((prev) => [...prev, newMsg])

            // Mark as read immediately
            supabase
              .from('messages')
              .update({ read_at: new Date().toISOString() })
              .eq('id', newMsg.id)
              .then(() => {})
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [chatId, currentUserId, supabase])

  const handleSend = async () => {
    const content = input.trim()
    if (!content || sending) return

    setSending(true)
    setInput('')

    // Optimistic update
    const tempId = `temp-${Date.now()}`
    const tempMsg: Message = {
      id: tempId,
      chat_id: chatId,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempMsg])

    const { data, error } = await supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: currentUserId,
        content,
      })
      .select()
      .single()

    if (error) {
      // Remove the optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      setInput(content) // restore input
    } else if (data) {
      // Replace temp message with real one
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? (data as Message) : m))
      )
    }

    setSending(false)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-PH', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  // Group messages by date
  const grouped: { date: string; messages: Message[] }[] = []
  for (const msg of messages) {
    const dateKey = new Date(msg.created_at).toDateString()
    const last = grouped[grouped.length - 1]
    if (last && last.date === dateKey) {
      last.messages.push(msg)
    } else {
      grouped.push({ date: dateKey, messages: [msg] })
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#F5F4F1]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#ECE8E0] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-1 -ml-1 text-[#1565D8] active:opacity-70"
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <Avatar
          src={otherUser.avatar_url}
          firstName={otherUser.first_name}
          lastName={otherUser.last_name}
          size={40}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[#1A1A1A] text-sm truncate">
            {otherUser.first_name} {otherUser.last_name}
          </p>
          {otherUser.role && (
            <p className="text-xs text-[#6B6560] capitalize">{otherUser.role}</p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24 space-y-1">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#6B6560] text-sm">
              Say hello to {otherUser.first_name}!
            </p>
          </div>
        )}

        {grouped.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#ECE8E0]" />
              <span className="text-xs text-[#6B6560] font-medium">
                {formatDateHeader(group.messages[0].created_at)}
              </span>
              <div className="flex-1 h-px bg-[#ECE8E0]" />
            </div>

            {group.messages.map((msg, idx) => {
              const isMe = msg.sender_id === currentUserId
              const isTemp = msg.id.startsWith('temp-')
              const prevMsg = idx > 0 ? group.messages[idx - 1] : null
              const showAvatar = !isMe && (!prevMsg || prevMsg.sender_id !== msg.sender_id)

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} mb-1`}
                >
                  {/* Other user avatar */}
                  {!isMe && (
                    <div className="w-7 flex-shrink-0">
                      {showAvatar && (
                        <Avatar
                          src={otherUser.avatar_url}
                          firstName={otherUser.first_name}
                          lastName={otherUser.last_name}
                          size={28}
                        />
                      )}
                    </div>
                  )}

                  <div className={`max-w-[72%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-[#1565D8] text-white rounded-br-sm'
                          : 'bg-white text-[#1A1A1A] rounded-bl-sm shadow-sm'
                      } ${isTemp ? 'opacity-60' : ''}`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-[#6B6560] mt-0.5 px-1">
                      {formatTime(msg.created_at)}
                      {isMe && !isTemp && (
                        <span className="ml-1">
                          {msg.read_at ? '✓✓' : '✓'}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#ECE8E0] px-3 py-2 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message…"
          rows={1}
          className="flex-1 resize-none rounded-full bg-[#F5F4F1] px-4 py-2.5 text-sm text-[#1A1A1A] placeholder-[#6B6560] outline-none max-h-32 overflow-y-auto"
          style={{ lineHeight: '1.4' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            input.trim() && !sending
              ? 'bg-[#1565D8] text-white active:bg-[#166FE5]'
              : 'bg-[#ECE8E0] text-[#6B6560]'
          }`}
          aria-label="Send message"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
