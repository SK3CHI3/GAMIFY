'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Users, DollarSign, Calendar, Play, Pause, CheckCircle, Loader2, Trash2, PlayCircle } from 'lucide-react'
import { format } from 'date-fns'
import { startTournament, pauseTournament, resumeTournament, deleteTournament } from '@/app/actions/tournaments'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function TournamentsManageTab() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [startingTournament, setStartingTournament] = useState<string | null>(null)
  const [pausingTournament, setPausingTournament] = useState<string | null>(null)
  const [deletingTournament, setDeletingTournament] = useState<string | null>(null)
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
    setStartingTournament(tournamentId)
    
    try {
      const result = await startTournament(tournamentId)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Tournament started successfully!')
        router.refresh()
        // Reload tournaments
        const supabase = createClient()
        const { data } = await supabase
          .from('tournaments')
          .select('*')
          .order('created_at', { ascending: false })
        setTournaments(data || [])
      }
    } catch (error) {
      toast.error('Failed to start tournament')
    } finally {
      setStartingTournament(null)
    }
  }

  const handlePauseTournament = async (tournamentId: string) => {
    setPausingTournament(tournamentId)
    
    try {
      const result = await pauseTournament(tournamentId)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Tournament paused successfully!')
        router.refresh()
        // Reload tournaments
        const supabase = createClient()
        const { data } = await supabase
          .from('tournaments')
          .select('*')
          .order('created_at', { ascending: false })
        setTournaments(data || [])
      }
    } catch (error) {
      toast.error('Failed to pause tournament')
    } finally {
      setPausingTournament(null)
    }
  }

  const handleResumeTournament = async (tournamentId: string) => {
    setPausingTournament(tournamentId)
    
    try {
      const result = await resumeTournament(tournamentId)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Tournament resumed successfully!')
        router.refresh()
        // Reload tournaments
        const supabase = createClient()
        const { data } = await supabase
          .from('tournaments')
          .select('*')
          .order('created_at', { ascending: false })
        setTournaments(data || [])
      }
    } catch (error) {
      toast.error('Failed to resume tournament')
    } finally {
      setPausingTournament(null)
    }
  }

  const handleDeleteTournament = async (tournamentId: string) => {
    if (!confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
      return
    }

    setDeletingTournament(tournamentId)
    
    try {
      const result = await deleteTournament(tournamentId)
      
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Tournament deleted successfully!')
        router.refresh()
        // Reload tournaments
        const supabase = createClient()
        const { data } = await supabase
          .from('tournaments')
          .select('*')
          .order('created_at', { ascending: false })
        setTournaments(data || [])
      }
    } catch (error) {
      toast.error('Failed to delete tournament')
    } finally {
      setDeletingTournament(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Header Skeleton */}
        <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div>
              <Skeleton className="h-7 w-56 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </div>

        {/* Tournaments List Skeleton */}
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Skeleton className="h-6 w-64 mb-2" />
                  <Skeleton className="h-4 w-96 mb-3" />
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-5 w-32" />
                    ))}
                  </div>
                </div>
                <Skeleton className="w-20 h-9" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const statusColors = {
    registration: 'bg-blue-500 text-white',
    ongoing: 'bg-emerald-500 text-white',
    paused: 'bg-yellow-500 text-white',
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
                <Link href={`/admin/tournaments/${tournament.id}`} className="flex-1 cursor-pointer group">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{tournament.name}</h3>
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
                </Link>

                <div className="flex gap-2">
                  {tournament.status === 'registration' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleStartTournament(tournament.id)}
                        disabled={startingTournament === tournament.id}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30"
                      >
                        {startingTournament === tournament.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4 mr-1" />
                        )}
                        Start
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTournament(tournament.id)}
                        disabled={deletingTournament === tournament.id}
                      >
                        {deletingTournament === tournament.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </>
                  )}
                  {tournament.status === 'ongoing' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePauseTournament(tournament.id)}
                        disabled={pausingTournament === tournament.id}
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        {pausingTournament === tournament.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Pause className="w-4 h-4 mr-1" />
                        )}
                        Pause
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTournament(tournament.id)}
                        disabled={deletingTournament === tournament.id}
                      >
                        {deletingTournament === tournament.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </>
                  )}
                  {tournament.status === 'paused' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResumeTournament(tournament.id)}
                        disabled={pausingTournament === tournament.id}
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                      >
                        {pausingTournament === tournament.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <PlayCircle className="w-4 h-4 mr-1" />
                        )}
                        Resume
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteTournament(tournament.id)}
                        disabled={deletingTournament === tournament.id}
                      >
                        {deletingTournament === tournament.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </>
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
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Tournaments Yet</h3>
                <p className="text-gray-600">Create your first tournament to get started!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

