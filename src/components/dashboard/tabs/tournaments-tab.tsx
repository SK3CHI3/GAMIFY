'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TournamentCard } from '@/components/tournaments/tournament-card'
import { TournamentDetail } from '@/components/tournaments/tournament-detail'
import { TournamentBracket } from '@/components/tournaments/tournament-bracket'
import { Trophy, Clock, CheckCircle, Loader2, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent } from '@/components/ui/dialog'

export function TournamentsTab() {
  const [loading, setLoading] = useState(true)
  const [registrationTournaments, setRegistrationTournaments] = useState<any[]>([])
  const [ongoingTournaments, setOngoingTournaments] = useState<any[]>([])
  const [completedTournaments, setCompletedTournaments] = useState<any[]>([])
  const [userTournamentIds, setUserTournamentIds] = useState<Set<string>>(new Set())
  const [selectedTournament, setSelectedTournament] = useState<any>(null)
  const [userId, setUserId] = useState<string>('')
  const [tournamentMatches, setTournamentMatches] = useState<Map<string, any[]>>(new Map())

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      // Fetch tournaments by status
      const [registration, ongoing, completed, registrations] = await Promise.all([
        supabase.from('tournaments').select('*').eq('status', 'registration').order('created_at', { ascending: false }),
        supabase.from('tournaments').select('*').eq('status', 'ongoing').order('created_at', { ascending: false }),
        supabase.from('tournaments').select('*').eq('status', 'completed').order('created_at', { ascending: false }).limit(10),
        supabase.from('registrations').select('tournament_id').eq('user_id', user.id)
      ])

      setRegistrationTournaments(registration.data || [])
      setOngoingTournaments(ongoing.data || [])
      setCompletedTournaments(completed.data || [])
      setUserTournamentIds(new Set(registrations.data?.map(r => r.tournament_id) || []))

      // Fetch matches for ongoing tournaments
      if (ongoing.data && ongoing.data.length > 0) {
        const matchesMap = new Map()
        
        for (const tournament of ongoing.data) {
          const { data: matches } = await supabase
            .from('matches')
            .select(`
              *,
              player1:profiles!matches_player1_id_fkey(full_name),
              player2:profiles!matches_player2_id_fkey(full_name)
            `)
            .eq('tournament_id', tournament.id)
            .order('round', { ascending: true })
            .order('match_number', { ascending: true })
          
          if (matches) {
            matchesMap.set(tournament.id, matches)
          }
        }
        
        setTournamentMatches(matchesMap)
      }

      setLoading(false)
    }

    loadData()
  }, [])

  const handleTournamentClick = async (tournament: any) => {
    setSelectedTournament(tournament)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-blue-50/80 via-white/80 to-yellow-50/80 border border-blue-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tournaments
              </h1>
              <p className="text-gray-600 text-sm">Browse and join eFootball tournaments</p>
            </div>
          </div>
        </div>

        {/* Tournaments Tabs */}
        <Tabs defaultValue="registration" className="space-y-6">
          <TabsList className="backdrop-blur-xl bg-gradient-to-r from-blue-50/60 via-white/80 to-yellow-50/60 border border-blue-200/50 p-1 shadow-lg w-full rounded-2xl">
            <TabsTrigger 
              value="registration" 
              className="flex-1 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-blue-50"
            >
              <Clock className="w-4 h-4 mr-2" />
              Registration
            </TabsTrigger>
            <TabsTrigger 
              value="ongoing"
              className="flex-1 data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-yellow-50"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Ongoing
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="flex-1 data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-green-50"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registration" className="space-y-4">
            {registrationTournaments.length > 0 ? (
              <div className="grid gap-4">
                {registrationTournaments.map((tournament) => (
                  <div key={tournament.id} onClick={() => handleTournamentClick(tournament)}>
                    <TournamentCard 
                      tournament={tournament}
                      userRegistration={userTournamentIds.has(tournament.id) ? {} : undefined as any}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-12 text-center shadow-lg">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Open Registrations</h3>
                <p className="text-gray-600">Check back soon for new tournaments!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ongoing" className="space-y-6">
            {ongoingTournaments.length > 0 ? (
              <div className="space-y-6">
                {ongoingTournaments.map((tournament) => {
                  const matches = tournamentMatches.get(tournament.id) || []
                  
                  return (
                    <div key={tournament.id} className="backdrop-blur-xl bg-white/80 border border-blue-200/50 rounded-2xl p-6 shadow-lg space-y-4">
                      {/* Tournament Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{tournament.name}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              {tournament.format.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#FFFF00', color: '#000000' }}>
                              {tournament.current_participants}/{tournament.max_participants} Players
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            KES {tournament.entry_fee}
                          </div>
                          <div className="text-sm text-gray-600">Entry Fee</div>
                        </div>
                      </div>

                      {/* Tournament Bracket */}
                      {matches.length > 0 ? (
                        <TournamentBracket 
                          matches={matches}
                          format={tournament.format}
                          currentUserId={userId}
                        />
                      ) : (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
                          <Clock className="w-12 h-12 mx-auto mb-3 text-blue-500" />
                          <p className="text-gray-700 font-medium">Bracket is being generated...</p>
                          <p className="text-sm text-gray-600 mt-1">Matches will appear here shortly</p>
                        </div>
                      )}
                  </div>
                  )
                })}
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-12 text-center shadow-lg">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Ongoing Tournaments</h3>
                <p className="text-gray-600">Tournaments will appear here once they start</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedTournaments.length > 0 ? (
              <div className="grid gap-4">
                {completedTournaments.map((tournament) => (
                  <div key={tournament.id} onClick={() => handleTournamentClick(tournament)}>
                    <TournamentCard 
                      tournament={tournament}
                      userRegistration={userTournamentIds.has(tournament.id) ? {} : undefined as any}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-12 text-center shadow-lg">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Completed Tournaments</h3>
                <p className="text-gray-600">Completed tournaments will show here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Tournament Detail Modal */}
      <Dialog open={!!selectedTournament} onOpenChange={(open) => !open && setSelectedTournament(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 bg-white">
          {selectedTournament && (
            <TournamentDetail 
              tournament={selectedTournament} 
              userId={userId}
              onClose={() => setSelectedTournament(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

