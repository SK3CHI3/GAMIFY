'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TournamentCard } from '@/components/tournaments/tournament-card'
import { TournamentDetail } from '@/components/tournaments/tournament-detail'
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
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Tournaments
              </h1>
              <p className="text-gray-600 text-sm">Browse and join eFootball tournaments</p>
            </div>
          </div>
        </div>

        {/* Tournaments Tabs */}
        <Tabs defaultValue="registration" className="space-y-6">
          <TabsList className="backdrop-blur-xl bg-white/80 border border-white/40 p-1 shadow-lg w-full">
            <TabsTrigger 
              value="registration" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              <Clock className="w-4 h-4 mr-2" />
              Registration
            </TabsTrigger>
            <TabsTrigger 
              value="ongoing"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Ongoing
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
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

          <TabsContent value="ongoing" className="space-y-4">
            {ongoingTournaments.length > 0 ? (
              <div className="grid gap-4">
                {ongoingTournaments.map((tournament) => (
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
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 bg-gradient-to-br from-emerald-50/50 to-white">
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

