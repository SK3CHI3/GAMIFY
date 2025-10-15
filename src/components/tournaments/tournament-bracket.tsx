'use client'

import { Badge } from '@/components/ui/badge'
import { Trophy, Clock } from 'lucide-react'

interface Match {
  id: string
  round: number
  match_number: number
  bracket_type: string | null
  player1_id: string | null
  player2_id: string | null
  player1_score: number | null
  player2_score: number | null
  winner_id: string | null
  status: string
  player1?: { full_name: string } | null
  player2?: { full_name: string } | null
}

interface TournamentBracketProps {
  matches: Match[]
  format: string
  currentUserId: string
}

export function TournamentBracket({ matches, format, currentUserId }: TournamentBracketProps) {
  const winnerMatches = matches.filter(m => m.bracket_type === 'winner')
  const loserMatches = matches.filter(m => m.bracket_type === 'loser')
  
  const maxRound = Math.max(...winnerMatches.map(m => m.round), 0)

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-gray-400 text-white',
      ongoing: 'bg-blue-500 text-white',
      completed: 'bg-green-500 text-white',
      disputed: 'bg-red-500 text-white',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-400 text-white'
  }

  const renderMatch = (match: Match) => {
    const isUserMatch = match.player1_id === currentUserId || match.player2_id === currentUserId
    const player1Won = match.winner_id === match.player1_id
    const player2Won = match.winner_id === match.player2_id

    return (
      <div 
        key={match.id}
        className={`
          bg-white border rounded-xl p-4 space-y-2 min-w-[280px] shadow-md hover:shadow-lg transition-all
          ${isUserMatch ? 'border-2 border-yellow-400 shadow-yellow-500/20' : 'border-blue-200'}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-700">
            Round {match.round} • Match {match.match_number}
          </span>
          <Badge className={getStatusColor(match.status)}>
            {match.status}
          </Badge>
        </div>

        <div className="space-y-2">
          {/* Player 1 */}
          <div 
            className={`
              flex items-center justify-between p-3 rounded-lg border transition-all
              ${player1Won 
                ? 'bg-green-50 border-green-300 font-bold' 
                : isUserMatch 
                  ? 'bg-yellow-50/50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }
            `}
          >
            <span className="truncate text-sm text-gray-900">
              {match.player1 ? match.player1.full_name : 'TBD'}
            </span>
            <div className="flex items-center gap-2">
              {match.player1_score !== null && (
                <span className="ml-2 font-bold text-gray-900">{match.player1_score}</span>
              )}
              {player1Won && <Trophy className="w-4 h-4 text-yellow-500" />}
            </div>
          </div>

          {/* Player 2 */}
          <div 
            className={`
              flex items-center justify-between p-3 rounded-lg border transition-all
              ${player2Won 
                ? 'bg-green-50 border-green-300 font-bold' 
                : isUserMatch 
                  ? 'bg-yellow-50/50 border-yellow-200' 
                  : 'bg-gray-50 border-gray-200'
              }
            `}
          >
            <span className="truncate text-sm text-gray-900">
              {match.player2 ? match.player2.full_name : 'TBD'}
            </span>
            <div className="flex items-center gap-2">
              {match.player2_score !== null && (
                <span className="ml-2 font-bold text-gray-900">{match.player2_score}</span>
              )}
              {player2Won && <Trophy className="w-4 h-4 text-yellow-500" />}
            </div>
          </div>
        </div>

        {match.status === 'pending' && match.player1_id && match.player2_id && (
          <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Clock className="w-3 h-3 text-blue-500" />
            <span>Waiting for match to start</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Winner Bracket */}
      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
          <Trophy className="w-6 h-6 text-yellow-500" />
          {format === 'double_elimination' ? 'Winner Bracket' : 'Tournament Bracket'}
        </h3>

        <div className="overflow-x-auto">
          <div className="flex gap-6 pb-4">
            {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => {
              const roundMatches = winnerMatches.filter(m => m.round === round)
              
              return (
                <div key={round} className="space-y-4">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold text-center mb-4 shadow-md">
                    {round === maxRound ? '🏆 Finals' : `Round ${round}`}
                  </div>
                  {roundMatches.map(match => renderMatch(match))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Loser Bracket */}
      {format === 'double_elimination' && loserMatches.length > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-300 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
            <Trophy className="w-6 h-6 text-gray-500" />
            Loser Bracket
          </h3>

          <div className="overflow-x-auto">
            <div className="flex gap-6 pb-4">
              {Array.from({ length: Math.max(...loserMatches.map(m => m.round)) }, (_, i) => i + 1).map(round => {
                const roundMatches = loserMatches.filter(m => m.round === round)
                
                return (
                  <div key={round} className="space-y-4">
                    <div className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-bold text-center mb-4 shadow-md">
                      LB Round {round}
                    </div>
                    {roundMatches.map(match => renderMatch(match))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

