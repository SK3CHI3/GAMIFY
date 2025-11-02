'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TournamentHeader } from '@/components/tournaments/tournament-header'
import { TournamentBracket } from '@/components/tournaments/tournament-bracket'
import { TournamentChat } from '@/components/tournaments/tournament-chat'
import { RegisterButton } from '@/components/tournaments/register-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Loader2, X } from 'lucide-react'
import Link from 'next/link'

interface TournamentDetailProps {
  tournament: any
  userId: string
  onClose: () => void
}

export function TournamentDetail({ tournament, userId, onClose }: TournamentDetailProps) {
  const [loading, setLoading] = useState(true)
  const [userRegistration, setUserRegistration] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [userMatch, setUserMatch] = useState<any>(null)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      // Get user name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', userId)
        .single()

      setUserName(profile?.full_name || '')

      // Check if user is registered
      const { data: registration } = await supabase
        .from('registrations')
        .select('*')
        .eq('tournament_id', tournament.id)
        .eq('user_id', userId)
        .single()

      setUserRegistration(registration)

      // Fetch participants
      const { data: participantsData } = await supabase
        .from('registrations')
        .select('*, profiles(*)')
        .eq('tournament_id', tournament.id)
        .eq('status', 'confirmed')

      setParticipants(participantsData || [])

      // Fetch matches
      const { data: matchesData } = await supabase
        .from('matches')
        .select('*, player1:player1_id(full_name), player2:player2_id(full_name)')
        .eq('tournament_id', tournament.id)
        .order('round', { ascending: true })

      setMatches(matchesData || [])

      // Find user's active match
      const activeMatch = matchesData?.find(
        m => 
          (m.player1_id === userId || m.player2_id === userId) && 
          m.status === 'ongoing'
      )
      setUserMatch(activeMatch)

      setLoading(false)
    }

    loadData()
  }, [tournament.id, userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Close Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <TournamentHeader 
        tournament={tournament} 
        isRegistered={!!userRegistration}
        participantCount={participants.length}
      />

      {!userRegistration && tournament.status === 'registration' && (
        <RegisterButton tournamentId={tournament.id} entryFee={tournament.entry_fee} />
      )}

      {userMatch && (
        <div className="backdrop-blur-xl bg-white/80 border-2 border-emerald-500 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-2 text-gray-900">Your Active Match</h3>
          <p className="text-gray-600 mb-4">
            You are currently matched against{' '}
            {userMatch.player1_id === userId 
              ? userMatch.player2?.full_name 
              : userMatch.player1?.full_name}
          </p>
          <Link href={`/dashboard/matches/${userMatch.id}/submit`}>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30">
              Submit Match Result
            </Button>
          </Link>
        </div>
      )}

      <Tabs defaultValue="bracket" className="w-full">
        <TabsList className="grid w-full grid-cols-3 backdrop-blur-xl bg-white/80 border border-white/40">
          <TabsTrigger 
            value="bracket"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
          >
            Bracket
          </TabsTrigger>
          <TabsTrigger 
            value="participants"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
          >
            Players
          </TabsTrigger>
          <TabsTrigger 
            value="chat"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
          >
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bracket" className="mt-6">
          {matches.length > 0 ? (
            <TournamentBracket 
              matches={matches} 
              format={tournament.format}
              currentUserId={userId}
            />
          ) : (
            <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-8 text-center text-gray-600 shadow-lg">
              <p>Bracket will be generated when tournament starts</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="participants" className="mt-6">
          <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              Registered Players ({participants.length}/{tournament.max_slots})
            </h3>
            <div className="grid gap-3">
              {participants.length > 0 ? (
                participants.map((participant: any) => (
                  <div 
                    key={participant.id}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50/50 to-white rounded-xl border border-white/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                        {participant.profiles?.full_name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{participant.profiles?.full_name}</span>
                    </div>
                    {participant.user_id === userId && (
                      <span className="text-sm bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-semibold">You</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 py-4">No participants yet</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          {userRegistration ? (
            <TournamentChat 
              tournamentId={tournament.id}
              currentUserId={userId}
              currentUserName={userName}
            />
          ) : (
            <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-8 text-center text-gray-600 shadow-lg">
              <p>Register for the tournament to access chat</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

