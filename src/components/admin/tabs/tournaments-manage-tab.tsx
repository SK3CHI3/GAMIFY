'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Users, DollarSign, Calendar, Loader2, Play, Pause, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

export function TournamentsManageTab() {
  const [loading, setLoading] = useState(true)
  const [tournaments, setTournaments] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const { data } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false })

      setTournaments(data || [])
      setLoading(false)
    }

    loadData()
  }, [])

  const handleStartTournament = async (tournamentId: string) => {
    // TODO: Implement tournament start logic
    console.log('Starting tournament:', tournamentId)
  }

  const handlePauseTournament = async (tournamentId: string) => {
    // TODO: Implement tournament pause logic
    console.log('Pausing tournament:', tournamentId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  const statusColors = {
    registration: 'bg-blue-500 text-white',
    ongoing: 'bg-emerald-500 text-white',
    completed: 'bg-gray-500 text-white',
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Tournament Management
            </h1>
            <p className="text-gray-600 text-sm">Manage all tournaments and their status</p>
          </div>
        </div>
      </div>

      {/* Tournaments List */}
      <div className="grid gap-4">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <div 
              key={tournament.id}
              className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tournament.name}</h3>
                  {tournament.description && (
                    <p className="text-gray-600 text-sm mb-3">{tournament.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={statusColors[tournament.status as keyof typeof statusColors]}>
                      {tournament.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50">
                      {tournament.format.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>{tournament.current_players || 0} / {tournament.max_slots} players</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>KES {tournament.entry_fee}</span>
                    </div>
                    {tournament.start_date && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>{format(new Date(tournament.start_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        KES {tournament.prize_pool}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {tournament.status === 'registration' && (
                    <Button
                      size="sm"
                      onClick={() => handleStartTournament(tournament.id)}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30"
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  )}
                  {tournament.status === 'ongoing' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePauseTournament(tournament.id)}
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  {tournament.status === 'completed' && (
                    <Badge variant="outline" className="border-gray-400 text-gray-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Done
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-12 text-center shadow-lg">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tournaments Yet</h3>
            <p className="text-gray-600">Create your first tournament to get started!</p>
          </div>
        )}
      </div>
    </div>
  )
}

