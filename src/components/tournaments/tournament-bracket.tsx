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
      pending: 'bg-gray-300',
      ongoing: 'bg-blue-500',
      completed: 'bg-[#00FF88]',
      disputed: 'bg-red-500',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-300'
  }

  const renderMatch = (match: Match) => {
    const isUserMatch = match.player1_id === currentUserId || match.player2_id === currentUserId
    const player1Won = match.winner_id === match.player1_id
    const player2Won = match.winner_id === match.player2_id

    return (
      <div 
        key={match.id}
        className={`
          glass-card p-4 space-y-2 min-w-[250px]
          ${isUserMatch ? 'border-2 border-[#00FF88]' : ''}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600">
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
              flex items-center justify-between p-2 rounded
              ${player1Won ? 'bg-[#00FF88]/20 font-bold' : 'bg-gray-50'}
            `}
          >
            <span className="truncate">
              {match.player1 ? match.player1.full_name : 'TBD'}
            </span>
            {match.player1_score !== null && (
              <span className="ml-2 font-bold">{match.player1_score}</span>
            )}
            {player1Won && <Trophy className="w-4 h-4 ml-2 text-[#FFB800]" />}
          </div>

          {/* Player 2 */}
          <div 
            className={`
              flex items-center justify-between p-2 rounded
              ${player2Won ? 'bg-[#00FF88]/20 font-bold' : 'bg-gray-50'}
            `}
          >
            <span className="truncate">
              {match.player2 ? match.player2.full_name : 'TBD'}
            </span>
            {match.player2_score !== null && (
              <span className="ml-2 font-bold">{match.player2_score}</span>
            )}
            {player2Won && <Trophy className="w-4 h-4 ml-2 text-[#FFB800]" />}
          </div>
        </div>

        {match.status === 'pending' && match.player1_id && match.player2_id && (
          <div className="flex items-center gap-2 text-xs text-gray-600 pt-2">
            <Clock className="w-3 h-3" />
            <span>Waiting for match to start</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Winner Bracket */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-[#FFB800]" />
          {format === 'double_elimination' ? 'Winner Bracket' : 'Tournament Bracket'}
        </h3>

        <div className="overflow-x-auto">
          <div className="flex gap-6 pb-4">
            {Array.from({ length: maxRound }, (_, i) => i + 1).map(round => {
              const roundMatches = winnerMatches.filter(m => m.round === round)
              
              return (
                <div key={round} className="space-y-4">
                  <h4 className="text-sm font-semibold text-center text-gray-600 mb-4">
                    {round === maxRound ? 'Finals' : `Round ${round}`}
                  </h4>
                  {roundMatches.map(match => renderMatch(match))}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Loser Bracket */}
      {format === 'double_elimination' && loserMatches.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-gray-500" />
            Loser Bracket
          </h3>

          <div className="overflow-x-auto">
            <div className="flex gap-6 pb-4">
              {Array.from({ length: Math.max(...loserMatches.map(m => m.round)) }, (_, i) => i + 1).map(round => {
                const roundMatches = loserMatches.filter(m => m.round === round)
                
                return (
                  <div key={round} className="space-y-4">
                    <h4 className="text-sm font-semibold text-center text-gray-600 mb-4">
                      LB Round {round}
                    </h4>
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

