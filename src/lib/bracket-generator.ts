import { TablesInsert } from './database.types'

type Match = Omit<TablesInsert<'matches'>, 'tournament_id'>

interface BracketResult {
  matches: Match[]
  totalRounds: number
}

export function generateSingleEliminationBracket(
  players: string[],
  tournamentId: string
): BracketResult {
  const playerCount = players.length
  const totalRounds = Math.ceil(Math.log2(playerCount))
  const matches: Match[] = []

  // Calculate total matches needed for perfect bracket
  const perfectBracketSize = Math.pow(2, totalRounds)
  const byesNeeded = perfectBracketSize - playerCount

  // First round setup
  let matchNumber = 1
  let playerIndex = 0

  // Create first round matches
  for (let i = 0; i < perfectBracketSize / 2; i++) {
    const player1 = playerIndex < players.length ? players[playerIndex++] : null
    const player2 = playerIndex < players.length ? players[playerIndex++] : null

    // If one player has a bye, they automatically advance
    if (!player2 && player1) {
      // Player gets a bye - will be advanced in next round pairing
      continue
    }

    matches.push({
      round: 1,
      match_number: matchNumber++,
      bracket_type: 'winner',
      player1_id: player1,
      player2_id: player2,
      status: 'pending',
    })
  }

  // Create placeholder matches for subsequent rounds
  let previousRoundMatches = matches.length
  for (let round = 2; round <= totalRounds; round++) {
    const matchesInRound = previousRoundMatches / 2
    
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        round,
        match_number: matchNumber++,
        bracket_type: 'winner',
        player1_id: null,
        player2_id: null,
        status: 'pending',
      })
    }
    
    previousRoundMatches = matchesInRound
  }

  return {
    matches,
    totalRounds,
  }
}

export function generateDoubleEliminationBracket(
  players: string[],
  tournamentId: string
): BracketResult {
  const playerCount = players.length
  const totalWinnerRounds = Math.ceil(Math.log2(playerCount))
  const matches: Match[] = []

  // Winner bracket (same as single elimination)
  const winnerBracket = generateSingleEliminationBracket(players, tournamentId)
  matches.push(...winnerBracket.matches)

  // Loser bracket setup
  // In double elimination, losers from winner bracket go to loser bracket
  // Loser bracket has approximately 2x rounds - 1
  const totalLoserRounds = (totalWinnerRounds * 2) - 1
  
  let matchNumber = matches.length + 1
  
  // Create loser bracket matches
  for (let round = 1; round <= totalLoserRounds; round++) {
    // Number of matches in each loser round alternates
    const matchesInRound = Math.ceil((playerCount / Math.pow(2, Math.ceil(round / 2))) / 2)
    
    for (let i = 0; i < matchesInRound; i++) {
      matches.push({
        round,
        match_number: matchNumber++,
        bracket_type: 'loser',
        player1_id: null,
        player2_id: null,
        status: 'pending',
      })
    }
  }

  // Grand finals (winner bracket winner vs loser bracket winner)
  matches.push({
    round: totalWinnerRounds + 1,
    match_number: matchNumber++,
    bracket_type: 'winner',
    player1_id: null,
    player2_id: null,
    status: 'pending',
  })

  return {
    matches,
    totalRounds: totalWinnerRounds + totalLoserRounds + 1,
  }
}

export function advanceWinner(
  matches: Match[],
  completedMatchId: string,
  winnerId: string,
  loserId: string,
  format: 'single_elimination' | 'double_elimination'
): Match[] {
  const completedMatch = matches.find(m => m.match_number.toString() === completedMatchId)
  
  if (!completedMatch) return matches

  const { round, bracket_type } = completedMatch

  if (format === 'single_elimination') {
    // Find next match in winner bracket
    const nextRound = round + 1
    const nextMatch = matches.find(
      m => m.round === nextRound && m.bracket_type === 'winner' && (!m.player1_id || !m.player2_id)
    )

    if (nextMatch) {
      if (!nextMatch.player1_id) {
        nextMatch.player1_id = winnerId
      } else if (!nextMatch.player2_id) {
        nextMatch.player2_id = winnerId
      }
    }
  } else {
    // Double elimination logic
    if (bracket_type === 'winner') {
      // Winner advances in winner bracket
      const nextMatch = matches.find(
        m => m.round === round + 1 && m.bracket_type === 'winner' && (!m.player1_id || !m.player2_id)
      )
      
      if (nextMatch) {
        if (!nextMatch.player1_id) {
          nextMatch.player1_id = winnerId
        } else if (!nextMatch.player2_id) {
          nextMatch.player2_id = winnerId
        }
      }

      // Loser goes to loser bracket
      const loserMatch = matches.find(
        m => m.bracket_type === 'loser' && (!m.player1_id || !m.player2_id)
      )
      
      if (loserMatch) {
        if (!loserMatch.player1_id) {
          loserMatch.player1_id = loserId
        } else if (!loserMatch.player2_id) {
          loserMatch.player2_id = loserId
        }
      }
    } else {
      // Loser bracket - winner advances, loser is eliminated
      const nextMatch = matches.find(
        m => m.round === round + 1 && m.bracket_type === 'loser' && (!m.player1_id || !m.player2_id)
      )
      
      if (nextMatch) {
        if (!nextMatch.player1_id) {
          nextMatch.player1_id = winnerId
        } else if (!nextMatch.player2_id) {
          nextMatch.player2_id = winnerId
        }
      }
    }
  }

  return matches
}

