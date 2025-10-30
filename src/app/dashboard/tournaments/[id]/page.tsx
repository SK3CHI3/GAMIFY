'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { TournamentHeader } from '@/components/tournaments/tournament-header'
import { RegisterButton } from '@/components/tournaments/register-button'
import { TournamentBracket } from '@/components/tournaments/tournament-bracket'
import { TournamentChat } from '@/components/tournaments/tournament-chat'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Trophy, Users, AlertCircle, Play, MessageSquare } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

export default function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [tournament, setTournament] = useState<any>(null)
  const [matches, setMatches] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])
  const [userMatch, setUserMatch] = useState<any>(null)
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([])
  const [userId, setUserId] = useState<string>('')
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/sign-in')
        return
      }
      
      setUserId(user.id)
      
      // Get tournament ID from params
      const resolvedParams = await params
      const tournamentId = resolvedParams.id

      // Fetch tournament
      const { data: tournamentData } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single()

      if (!tournamentData) {
        router.push('/dashboard')
        return
      }

      setTournament(tournamentData)

      // Check registration
      const { data: registration } = await supabase
        .from('registrations')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('user_id', user.id)
        .single()

      setIsRegistered(!!registration)

      // Fetch participants
      const { data: participantsData } = await supabase
        .from('registrations')
        .select('*, profiles(*)')
        .eq('tournament_id', tournamentId)
        .eq('status', 'confirmed')

      setParticipants(participantsData || [])

      // Fetch matches
      const { data: matchesData } = await supabase
        .from('matches')
        .select('*, player1:player1_id(full_name), player2:player2_id(full_name)')
        .eq('tournament_id', tournamentId)
        .order('round', { ascending: true })
        .order('match_number', { ascending: true })

      setMatches(matchesData || [])

      // Find user's active match
      const activeMatch = matchesData?.find(
        m => 
          (m.player1_id === user.id || m.player2_id === user.id) && 
          m.status === 'ongoing'
      )
      setUserMatch(activeMatch)

      // Find user's upcoming matches (where they're assigned but match hasn't started)
      const upcoming = matchesData?.filter(
        m => 
          (m.player1_id === user.id || m.player2_id === user.id) && 
          m.status === 'pending' &&
          m.player1_id &&
          m.player2_id
      ) || []
      setUpcomingMatches(upcoming)

      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!tournament) return null

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
      <TournamentHeader 
        tournament={tournament} 
        isRegistered={isRegistered}
        participantCount={participants?.length || 0}
      />

      {!isRegistered && tournament.status === 'registration' && (
        <div className="mt-6">
          <RegisterButton tournamentId={tournament.id} />
        </div>
      )}

      {/* Active Match Alert */}
      {userMatch && (
        <Card className="border-2 border-blue-600 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Play className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Your Active Match</h3>
                  {userMatch.deadline && (
                    <Badge variant="destructive" className="ml-2">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(new Date(userMatch.deadline), { addSuffix: true })}
                    </Badge>
                  )}
                </div>
                <p className="text-gray-700 mb-4 text-lg">
                  You are currently matched against{' '}
                  <span className="font-bold text-blue-600">
                    {userMatch.player1_id === userId 
                      ? userMatch.player2?.full_name 
                      : userMatch.player1?.full_name}
                  </span>
                </p>
                {userMatch.deadline && (
                  <p className="text-sm text-gray-600 mb-4">
                    Deadline: {format(new Date(userMatch.deadline), 'PPpp')}
                  </p>
                )}
              </div>
              <Link href={`/dashboard/matches/${userMatch.id}/submit`}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Submit Match Result
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && !userMatch && (
        <Card className="border border-yellow-500 bg-yellow-50/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-yellow-600" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Upcoming Match</h3>
                <p className="text-gray-700">
                  You have {upcomingMatches.length} upcoming match{upcomingMatches.length > 1 ? 'es' : ''} scheduled. 
                  You'll be notified when it's time to play.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="bracket" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
          <TabsTrigger value="bracket" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Bracket
          </TabsTrigger>
          <TabsTrigger value="participants" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Players
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bracket" className="mt-6">
          {matches && matches.length > 0 ? (
            <TournamentBracket 
              matches={matches} 
              format={tournament.format}
              currentUserId={userId}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Bracket Not Ready</h3>
                <p className="text-gray-600">Bracket will be generated when tournament starts</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="participants" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Registered Players ({participants?.length || 0}/{tournament.max_slots})
              </h3>
              <div className="grid gap-3">
                {participants && participants.length > 0 ? (
                  participants.map((participant: any) => (
                    <div 
                      key={participant.id}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                          {participant.profiles?.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{participant.profiles?.full_name}</span>
                      </div>
                      {participant.user_id === userId && (
                        <Badge className="bg-blue-600 text-white">You</Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-600">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No participants yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          {isRegistered ? (
            <TournamentChat 
              tournamentId={tournament.id}
              currentUserId={userId}
              currentUserName={participants?.find(p => p.user_id === userId)?.profiles?.full_name || 'User'}
            />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Register to Chat</h3>
                <p className="text-gray-600">Register for the tournament to access chat</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
