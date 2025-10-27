'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Trophy, 
  Users, 
  Play, 
  Pause, 
  Settings,
  Eye,
  Crown,
  Target,
  Calendar,
  DollarSign
} from 'lucide-react'
import { format } from 'date-fns'

interface Tournament {
  id: string
  name: string
  description: string
  status: string
  format: string
  mode: string
  entry_fee: number
  prize_pool: number
  max_slots: number
  current_players: number
  start_date: string
  end_date: string
  created_at: string
  bracket_data?: any
  matches?: Match[]
}

interface Match {
  id: string
  round: number
  position: number
  player1_id: string
  player2_id: string
  player1_name: string
  player2_name: string
  player1_score: number
  player2_score: number
  status: string
  winner_id: string
  scheduled_at: string
  completed_at: string
}

interface BracketNode {
  id: string
  round: number
  position: number
  players: { id: string; name: string; score?: number }[]
  status: 'pending' | 'ongoing' | 'completed'
  winner?: { id: string; name: string }
  match?: Match
}

export function LiveBracket({ tournamentId }: { tournamentId: string }) {
  const [loading, setLoading] = useState(true)
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [bracketNodes, setBracketNodes] = useState<BracketNode[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  useEffect(() => {
    async function loadTournament() {
      const supabase = createClient()
      
      try {
        // Load tournament data
        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', tournamentId)
          .single()

        if (tournamentError) {
          console.error('Tournament error:', tournamentError)
          throw tournamentError
        }

        // Load matches separately
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*')
          .eq('tournament_id', tournamentId)
          .order('round', { ascending: true })
          .order('position', { ascending: true })

        if (matchesError) {
          console.error('Matches error:', matchesError)
        }

        // Load player names for matches
        const matches = matchesData || []
        const enrichedMatches = await Promise.all(
          matches.map(async (match) => {
            const { data: player1 } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', match.player1_id)
              .single()

            const { data: player2 } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', match.player2_id)
              .single()

            return {
              ...match,
              player1_name: player1?.full_name || 'Player 1',
              player2_name: player2?.full_name || 'Player 2',
            }
          })
        )

        setTournament({
          ...tournamentData,
          matches: enrichedMatches,
        })

        // Generate bracket structure
        if (tournamentData.bracket_data) {
          generateBracketStructure(tournamentData.bracket_data, enrichedMatches)
        } else if (enrichedMatches.length > 0) {
          generateBracketStructure({}, enrichedMatches)
        }

      } catch (error) {
        console.error('Error loading tournament:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTournament()
  }, [tournamentId])

  const generateBracketStructure = (bracketData: any, matches: Match[]) => {
    const nodes: BracketNode[] = []
    const rounds = Math.ceil(Math.log2(tournament?.max_slots || 8))
    
    // Generate bracket nodes for each round
    for (let round = 0; round < rounds; round++) {
      const positionsInRound = Math.pow(2, rounds - round - 1)
      
      for (let pos = 0; pos < positionsInRound; pos++) {
        const match = matches.find(m => m.round === round && m.position === pos)
        
        nodes.push({
          id: `r${round}p${pos}`,
          round,
          position: pos,
          players: match ? [
            { id: match.player1_id, name: match.player1_name, score: match.player1_score },
            { id: match.player2_id, name: match.player2_name, score: match.player2_score }
          ] : [],
          status: match?.status === 'completed' ? 'completed' : match?.status === 'ongoing' ? 'ongoing' : 'pending',
          winner: match?.winner_id ? {
            id: match.winner_id,
            name: match.winner_id === match.player1_id ? match.player1_name : match.player2_name
          } : undefined,
          match
        })
      }
    }

    setBracketNodes(nodes)
  }

  const getRoundName = (round: number, totalRounds: number) => {
    if (round === totalRounds - 1) return 'Final'
    if (round === totalRounds - 2) return 'Semi-Final'
    if (round === totalRounds - 3) return 'Quarter-Final'
    return `Round ${round + 1}`
  }

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-300 text-green-800'
      case 'ongoing': return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'pending': return 'bg-gray-100 border-gray-300 text-gray-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }


  if (loading) {
    return (
      <div className="space-y-6">
        {/* Tournament Header Skeleton */}
        <Card className="glass-card border-none shadow-premium">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-96" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                  <Skeleton className="h-6 w-6 mx-auto mb-2" />
                  <Skeleton className="h-8 w-20 mx-auto mb-1" />
                  <Skeleton className="h-4 w-16 mx-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bracket Skeleton */}
        <Card className="glass-card border-none shadow-premium">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex gap-8">
              {[1, 2, 3].map((round) => (
                <div key={round} className="flex flex-col gap-4 min-w-[200px]">
                  <Skeleton className="h-6 w-32 mx-auto" />
                  <div className="space-y-4">
                    {[1, 2].map((match) => (
                      <Skeleton key={match} className="h-32 w-full rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Tournament Not Found</h3>
            <p className="text-gray-600">This tournament doesn't exist or has been deleted.</p>
          </div>
        </div>
      </div>
    )
  }

  const totalRounds = Math.ceil(Math.log2(tournament.max_slots))
  const rounds = Array.from({ length: totalRounds }, (_, i) => i)

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <Card className="glass-card border-none shadow-premium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">{tournament.name}</CardTitle>
              <p className="text-gray-600 mt-1">{tournament.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${
                tournament.status === 'ongoing' ? 'bg-green-500' :
                tournament.status === 'completed' ? 'bg-gray-500' :
                'bg-blue-500'
              } text-white`}>
                {tournament.status.replace('_', ' ')}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{tournament.current_players}</div>
              <div className="text-sm text-gray-600">Players</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
              <div className="text-2xl font-bold text-gray-900">KES {tournament.prize_pool?.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Prize Pool</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-amber-600" />
              <div className="text-2xl font-bold text-gray-900">{tournament.format.replace('_', ' ')}</div>
              <div className="text-sm text-gray-600">Format</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">
                {tournament.start_date ? format(new Date(tournament.start_date), 'MMM d') : 'TBD'}
              </div>
              <div className="text-sm text-gray-600">Start Date</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Bracket */}
      <Card className="glass-card border-none shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-emerald-600" />
            Live Tournament Bracket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex gap-8 min-w-max">
              {rounds.map((round) => (
                <div key={round} className="flex flex-col gap-4 min-w-[200px]">
                  <div className="text-center">
                    <h3 className="font-bold text-gray-900">
                      {getRoundName(round, totalRounds)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {Math.pow(2, totalRounds - round - 1)} matches
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {bracketNodes
                      .filter(node => node.round === round)
                      .map((node) => (
                        <div
                          key={node.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getNodeStatusColor(node.status)}`}
                          onClick={() => node.match && setSelectedMatch(node.match)}
                        >
                          {node.players.length > 0 ? (
                            <div className="space-y-2">
                              {node.players.map((player) => (
                                <div key={player.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {node.winner?.id === player.id && <Crown className="h-4 w-4 text-yellow-600" />}
                                    <span className="font-medium">{player.name}</span>
                                  </div>
                                  <span className="font-bold">{player.score || 0}</span>
                                </div>
                              ))}
                              {node.status === 'ongoing' && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Button size="sm" variant="outline" className="flex-1">
                                    <Play className="h-3 w-3 mr-1" />
                                    Start
                                  </Button>
                                  <Button size="sm" variant="outline" className="flex-1">
                                    <Pause className="h-3 w-3 mr-1" />
                                    Pause
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center text-gray-500 py-4">
                              <div className="text-sm">TBD</div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Details Modal */}
      {selectedMatch && (
        <Card className="glass-card border-none shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Match Details</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMatch(null)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold text-gray-900">{selectedMatch.player1_name}</h4>
                  <div className="text-3xl font-bold text-emerald-600 mt-2">
                    {selectedMatch.player1_score}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold text-gray-900">{selectedMatch.player2_name}</h4>
                  <div className="text-3xl font-bold text-emerald-600 mt-2">
                    {selectedMatch.player2_score}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Start Match
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

