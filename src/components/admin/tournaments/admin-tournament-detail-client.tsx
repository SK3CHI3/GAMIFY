'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TournamentHeader } from '@/components/tournaments/tournament-header'
import { TournamentBracket } from '@/components/tournaments/tournament-bracket'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Users, MessageSquare, Eye, Clock } from 'lucide-react'

interface AdminTournamentDetailClientProps {
  tournament: any
}

export function AdminTournamentDetailClient({ tournament: initialTournament }: AdminTournamentDetailClientProps) {
  const [loading, setLoading] = useState(true)
  const [tournament, setTournament] = useState<any>(initialTournament)
  const [matches, setMatches] = useState<any[]>([])
  const [participants, setParticipants] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      
      // Fetch tournament
      const { data: tournamentData } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', initialTournament.id)
        .single()
      
      if (tournamentData) {
        setTournament(tournamentData)
      }

      // Fetch participants
      const { data: participantsData } = await supabase
        .from('registrations')
        .select('*, profiles(*)')
        .eq('tournament_id', initialTournament.id)
        .eq('status', 'confirmed')

      setParticipants(participantsData || [])

      // Fetch matches
      const { data: matchesData } = await supabase
        .from('matches')
        .select('*, player1:player1_id(full_name), player2:player2_id(full_name)')
        .eq('tournament_id', initialTournament.id)
        .order('round', { ascending: true })
        .order('match_number', { ascending: true })

      setMatches(matchesData || [])
      setLoading(false)
    }

    loadData()

    // Set up real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel(`admin_tournament_detail_${initialTournament.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `tournament_id=eq.${initialTournament.id}`,
        },
        () => {
          console.log('Realtime match update')
          loadData()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations',
          filter: `tournament_id=eq.${initialTournament.id}`,
        },
        () => {
          console.log('Realtime registration update')
          loadData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [initialTournament.id])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <>
      <TournamentHeader tournament={tournament} isRegistered={false} participantCount={participants.length} />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/90 border border-blue-200/50 p-1 shadow-lg w-full rounded-2xl grid grid-cols-4 h-12">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-blue-50 text-sm px-3 py-2 flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="bracket"
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-emerald-50 text-sm px-3 py-2 flex items-center justify-center"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Bracket
          </TabsTrigger>
          <TabsTrigger 
            value="participants"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-yellow-50 text-sm px-3 py-2 flex items-center justify-center"
          >
            <Users className="w-4 h-4 mr-2" />
            Participants ({participants.length})
          </TabsTrigger>
          <TabsTrigger 
            value="disputes"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-red-50 text-sm px-3 py-2 flex items-center justify-center"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Disputes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Statistics Card */}
            <Card className="backdrop-blur-xl bg-white/80 border border-blue-200/50 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tournament Stats</h3>
                  <Trophy className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Total Players</span>
                    <span className="text-2xl font-bold text-blue-600">{participants.length}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Matches Completed</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      {matches.filter(m => m.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Matches</span>
                    <span className="text-2xl font-bold text-yellow-600">
                      {matches.filter(m => m.status === 'ongoing').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prize Distribution Card */}
            <Card className="backdrop-blur-xl bg-white/80 border border-blue-200/50 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Prize Pool</h3>
                  <Badge className="bg-emerald-500 text-white">Distributed</Badge>
                </div>
                <div className="space-y-3">
                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <div className="text-sm text-gray-600 mb-1">Total Prize Pool</div>
                    <div className="text-3xl font-bold text-emerald-600">KES {tournament.prize_pool?.toLocaleString() || 0}</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="flex justify-between mb-1">
                      <span>Platform Fee (25%)</span>
                      <span className="font-semibold">KES {((tournament.prize_pool || 0) * 0.25).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Players Pool (75%)</span>
                      <span className="font-semibold">KES {((tournament.prize_pool || 0) * 0.75).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tournament Info Card */}
            <Card className="backdrop-blur-xl bg-white/80 border border-blue-200/50 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tournament Info</h3>
                  <Badge className={tournament.status === 'registration' ? 'bg-blue-500' : tournament.status === 'ongoing' ? 'bg-emerald-500' : tournament.status === 'paused' ? 'bg-yellow-500' : 'bg-gray-500'}>
                    {tournament.status}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="pb-3 border-b">
                    <div className="text-sm text-gray-600 mb-1">Format</div>
                    <div className="text-lg font-semibold text-gray-900">{tournament.format.replace('_', ' ')}</div>
                  </div>
                  <div className="pb-3 border-b">
                    <div className="text-sm text-gray-600 mb-1">Entry Fee</div>
                    <div className="text-lg font-semibold text-blue-600">KES {tournament.entry_fee}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Max Slots</div>
                    <div className="text-lg font-semibold text-gray-900">{tournament.max_slots} players</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bracket" className="space-y-4">
          {tournament.status === 'registration' ? (
            <Card className="backdrop-blur-xl bg-white/80 border border-blue-200/50 rounded-2xl p-12 text-center shadow-lg">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bracket Not Yet Generated</h3>
              <p className="text-gray-600">The tournament bracket will appear here once registration closes and the tournament begins.</p>
            </Card>
          ) : matches.length > 0 ? (
            <TournamentBracket 
              matches={matches} 
              format={tournament.format} 
              currentUserId={''}
            />
          ) : (
            <Card className="backdrop-blur-xl bg-white/80 border border-blue-200/50 rounded-2xl p-12 text-center shadow-lg">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Matches Found</h3>
              <p className="text-gray-600">There was an issue loading the matches for this tournament.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <Card className="backdrop-blur-xl bg-white/80 border border-blue-200/50 rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Participants ({participants.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {participants.map((p) => (
                  <div key={p.user_id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-blue-100 font-semibold text-sm">
                      {p.profiles?.full_name ? p.profiles.full_name[0] : '?' }
                    </div>
                    <span className="font-medium text-gray-800">{p.profiles?.full_name || 'Unknown Player'}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="space-y-4">
          <Card className="backdrop-blur-xl bg-white/80 border border-blue-200/50 rounded-2xl shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Active Disputes</h3>
              <p className="text-gray-600 text-center py-8">No active disputes for this tournament.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

