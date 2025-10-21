'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { toast } from 'sonner'

interface Message {
  id: string
  message: string
  created_at: string
  profiles: {
    full_name: string
  }
  user_id: string
}

interface TournamentChatProps {
  tournamentId: string
  currentUserId: string
  currentUserName: string
}

export function TournamentChat({ tournamentId, currentUserId }: TournamentChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // Fetch initial messages
    fetchMessages()

    // Subscribe to new messages
    const channel = supabase
      .channel(`tournament-${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `tournament_id=eq.${tournamentId}`,
        },
        () => {
          // Fetch the complete message with profile data
          fetchMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tournamentId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*, profiles(full_name)')
      .eq('tournament_id', tournamentId)
      .order('created_at', { ascending: true })
      .limit(100)

    if (!error && data) {
      setMessages(data as Message[])
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    
    if (!newMessage.trim()) return

    setLoading(true)

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        tournament_id: tournamentId,
        user_id: currentUserId,
        message: newMessage.trim(),
      })

    if (error) {
      toast.error('Failed to send message')
    } else {
      setNewMessage('')
    }

    setLoading(false)
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="glass-card h-[600px] flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isCurrentUser = msg.user_id === currentUserId

            return (
              <div
                key={msg.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[70%] rounded-lg p-3
                    ${isCurrentUser 
                      ? 'gradient-primary text-white' 
                      : 'bg-white/50'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${isCurrentUser ? 'text-white' : 'text-gray-700'}`}>
                      {isCurrentUser ? 'You' : msg.profiles?.full_name}
                    </span>
                    <span className={`text-xs ${isCurrentUser ? 'text-white/70' : 'text-gray-500'}`}>
                      {format(new Date(msg.created_at), 'HH:mm')}
                    </span>
                  </div>
                  <p className={isCurrentUser ? 'text-white' : 'text-gray-800'}>
                    {msg.message}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-white/20 p-4">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={loading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="gradient-primary text-white shadow-glow-green"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}

