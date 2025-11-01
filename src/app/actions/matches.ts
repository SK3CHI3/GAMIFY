'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from './auth'

export async function submitMatchResult(formData: FormData) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) {
    return { error: 'You must be logged in' }
  }

  const matchId = formData.get('matchId') as string
  const isPlayer1 = formData.get('isPlayer1') === 'true'
  const score = parseInt(formData.get('score') as string)
  const screenshot = formData.get('screenshot') as File

  // Upload screenshot to Supabase Storage
  const fileExt = screenshot.name.split('.').pop()
  const fileName = `${user.id}/${matchId}-${Date.now()}.${fileExt}`
  
  const { error: uploadError } = await supabase.storage
    .from('match-screenshots')
    .upload(fileName, screenshot)

  if (uploadError) {
    return { error: 'Failed to upload screenshot' }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('match-screenshots')
    .getPublicUrl(fileName)

  // Update match with player's submission
  const updateData = isPlayer1
    ? {
        player1_score: score,
        player1_screenshot: publicUrl,
        player1_submitted: true,
      }
    : {
        player2_score: score,
        player2_screenshot: publicUrl,
        player2_submitted: true,
      }

  const { data: match, error: updateError } = await supabase
    .from('matches')
    .update(updateData)
    .eq('id', matchId)
    .select()
    .single()

  if (updateError) {
    return { error: updateError.message }
  }

  // Check if both players have submitted
  if (match.player1_submitted && match.player2_submitted) {
    const result = await verifyMatchResults(matchId)
    
    // If it's a draw, return draw info
    if (result?.draw) {
      return result
    }
  }

  revalidatePath(`/dashboard/matches/${matchId}`)
  revalidatePath('/dashboard')

  return { success: true }
}

async function verifyMatchResults(matchId: string) {
  const supabase = await createClient()

  const { data: match, error } = await supabase
    .from('matches')
    .select('*, tournament:tournaments(*)')
    .eq('id', matchId)
    .single()

  if (error || !match) {
    return
  }

  const { player1_score, player2_score, player1_id, player2_id, tournament_id } = match

  // Check if scores match (draw situation)
  if (player1_score === player2_score) {
    // It's a draw - replay the match
    // Reset scores and submissions but keep match as ongoing
    await supabase
      .from('matches')
      .update({
        player1_score: null,
        player2_score: null,
        player1_screenshot: null,
        player2_screenshot: null,
        player1_submitted: false,
        player2_submitted: false,
        status: 'ongoing',
        // Extend deadline by 10 minutes for replay
        deadline: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      })
      .eq('id', matchId)
    
    // Revalidate paths
    revalidatePath(`/dashboard/matches/${matchId}`)
    revalidatePath(`/dashboard/tournaments/${tournament_id}`)
    
    return { draw: true, message: 'Match ended in a draw. Replaying with fresh 10-minute timer.' }
  }

  // Check if one player claims they won
  const player1Claims = (player1_score ?? 0) > (player2_score ?? 0)
  const player2Claims = (player2_score ?? 0) > (player1_score ?? 0)

  // If both claim different winners, create dispute
  if (player1Claims && player2Claims) {
    await createDispute(matchId, 'Score mismatch - conflicting results')
    
    await supabase
      .from('matches')
      .update({ status: 'disputed' })
      .eq('id', matchId)
    
    return
  }

  // If scores indicate clear winner (one player's claim matches opponent's submission)
  // This is the ideal case where both players agree on the outcome
  let winnerId = null
  
  if (player1_score! > player2_score!) {
    winnerId = player1_id
  } else if (player2_score! > player1_score!) {
    winnerId = player2_id
  }

  if (winnerId) {
    // Update match as completed
    await supabase
      .from('matches')
      .update({
        status: 'completed',
        winner_id: winnerId,
        completed_at: new Date().toISOString(),
      })
      .eq('id', matchId)

    // Update player stats
    await updatePlayerStats(winnerId, player1_id === winnerId ? player2_id! : player1_id!)

    // Update registrations
    const loserId = player1_id === winnerId ? player2_id : player1_id
    
    await supabase
      .from('registrations')
      .update({ status: 'eliminated' })
      .eq('tournament_id', tournament_id)
      .eq('user_id', loserId)

    // Advance winner to next round
    await advanceToNextRound(matchId, winnerId!)

    revalidatePath(`/dashboard/tournaments/${tournament_id}`)
  }
}

async function createDispute(matchId: string, reason?: string) {
  const supabase = await createClient()

  await supabase
    .from('disputes')
    .insert({
      match_id: matchId,
      status: 'pending',
      admin_notes: reason || null,
    })

  revalidatePath('/admin/disputes')
}

async function updatePlayerStats(winnerId: string, loserId: string) {
  const supabase = await createClient()

  // Update winner stats
  await supabase.rpc('increment_player_wins', { player_id: winnerId })

  // Update loser stats
  await supabase.rpc('increment_player_losses', { player_id: loserId })
}

async function advanceToNextRound(
  matchId: string,
  winnerId: string
) {
  const supabase = await createClient()

  const { data: currentMatch } = await supabase
    .from('matches')
    .select('round, match_number, tournament_id, bracket_type')
    .eq('id', matchId)
    .single()

  if (!currentMatch) return

  // Find next match in the bracket
  const nextRound = currentMatch.round + 1

  const { data: nextMatch } = await supabase
    .from('matches')
    .select('*')
    .eq('tournament_id', currentMatch.tournament_id)
    .eq('round', nextRound)
    .eq('bracket_type', currentMatch.bracket_type)
    .or(`player1_id.is.null,player2_id.is.null`)
    .limit(1)
    .single()

  if (nextMatch) {
    // Assign winner to next match
    const updateField = !nextMatch.player1_id ? 'player1_id' : 'player2_id'

    await supabase
      .from('matches')
      .update({ [updateField]: winnerId })
      .eq('id', nextMatch.id)

    // If both players are now assigned, set match to ongoing
    if (nextMatch.player1_id || nextMatch.player2_id) {
      const { data: updatedMatch } = await supabase
        .from('matches')
        .select('*')
        .eq('id', nextMatch.id)
        .single()

      if (updatedMatch?.player1_id && updatedMatch?.player2_id) {
        // Set match to ongoing with 10 minute deadline
        const deadlineDate = new Date()
        deadlineDate.setMinutes(deadlineDate.getMinutes() + 10)
        
        await supabase
          .from('matches')
          .update({ 
            status: 'ongoing',
            deadline: deadlineDate.toISOString()
          })
          .eq('id', nextMatch.id)
      }
    }
  } else {
    // No next match means tournament is complete for this bracket
    await handleTournamentCompletion(currentMatch.tournament_id, winnerId)
  }
}

async function handleTournamentCompletion(tournamentId: string, winnerId: string) {
  const supabase = await createClient()

  // Get tournament info
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single()

  if (!tournament) return

  // Get all matches to determine final positions
  const { data: allMatches } = await supabase
    .from('matches')
    .select('*')
    .eq('tournament_id', tournamentId)
    .eq('status', 'completed')
    .order('round', { ascending: true })

  // Get all registered players
  const { data: allRegistrations } = await supabase
    .from('registrations')
    .select('user_id')
    .eq('tournament_id', tournamentId)
    .eq('status', 'confirmed')

  if (!allMatches || !allRegistrations) return

  // Determine final positions (top 3 only get prizes and points)
  const prizePool = parseFloat(String(tournament.prize_pool || 0))
  const positions = determineFinalPositions(allMatches, allRegistrations.map(r => r.user_id), prizePool)
  
  // Award points and update positions
  for (const { userId, position, prizeAmount } of positions) {
    let pointsAwarded = 0
    
    // Award points based on position
    if (position === 1) {
      pointsAwarded = 1000 // 1st place: 1000 points
    } else if (position === 2) {
      pointsAwarded = 500  // 2nd place: 500 points
    } else if (position === 3) {
      pointsAwarded = 250  // 3rd place: 250 points
    } else {
      // Participation points for all other players
      pointsAwarded = 100
    }

    // Update registration with position and prize
    await supabase
      .from('registrations')
      .update({
        position_finished: position,
        prize_amount: prizeAmount,
        points_awarded: pointsAwarded
      })
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId)

    // Update player stats with points (direct update since RPC doesn't exist yet)
    const { data: existingStats } = await supabase
      .from('player_stats')
      .select('tournament_points')
      .eq('user_id', userId)
      .single()
    
    if (existingStats) {
      await supabase
        .from('player_stats')
        .update({ tournament_points: (existingStats.tournament_points || 0) + pointsAwarded })
        .eq('user_id', userId)
    }

    // If in top 3, update earnings
    if (position !== null && position <= 3 && prizeAmount > 0) {
      const { data: stats } = await supabase
        .from('player_stats')
        .select('total_earnings')
        .eq('user_id', userId)
        .single()
      
      if (stats) {
        await supabase
          .from('player_stats')
          .update({ total_earnings: (parseFloat(String(stats.total_earnings || 0)) + prizeAmount) })
          .eq('user_id', userId)
      }
    }
  }

  // Mark tournament as completed
  await supabase
    .from('tournaments')
    .update({ 
      status: 'completed',
      end_date: new Date().toISOString()
    })
    .eq('id', tournamentId)
}

function determineFinalPositions(matches: any[], playerIds: string[], prizePool: number) {
  // Simple position determination based on match results
  // In real implementation, this would be more sophisticated
  
  const winners = matches.map(m => m.winner_id).filter(Boolean)
  const losers = matches.flatMap(m => [m.player1_id, m.player2_id])
    .filter(id => winners.includes(id))
  
  const uniqueWinners = [...new Set(winners)]
  const uniqueLosers = [...new Set(playerIds)].filter(id => !uniqueWinners.includes(id))
  
  // Determine top 3
  const positions: Array<{ userId: string; position: number | null; prizeAmount: number }> = []
  
  // Find final match (last round, last match)
  const finalMatch = matches.sort((a, b) => {
    if (a.round !== b.round) return b.round - a.round
    return b.match_number - a.match_number
  })[0]
  
  if (finalMatch && finalMatch.winner_id) {
    positions.push({
      userId: finalMatch.winner_id,
      position: 1,
      prizeAmount: prizePool * 0.45
    })
    
    // 2nd place (loser of final)
    const loserId = finalMatch.player1_id === finalMatch.winner_id 
      ? finalMatch.player2_id 
      : finalMatch.player1_id
    if (loserId) {
      positions.push({
        userId: loserId,
        position: 2,
        prizeAmount: prizePool * 0.225
      })
    }
  }
  
  // Find 3rd place (semifinal losers, if applicable)
  // For simplicity, we'll assign first loser as 3rd place
  const semifinalLosers = matches.filter(m => 
    m.round === Math.max(...matches.map(mm => mm.round)) - 1 && 
    m.status === 'completed'
  ).flatMap(m => [m.player1_id, m.player2_id].filter(id => id !== m.winner_id))
  
  if (semifinalLosers.length > 0 && !positions.find(p => p.position === 3)) {
    positions.push({
      userId: semifinalLosers[0],
      position: 3,
      prizeAmount: prizePool * 0.075
    })
  }
  
  // Add remaining players with participation points only
  playerIds.forEach(userId => {
    if (!positions.find(p => p.userId === userId)) {
      positions.push({
        userId,
        position: null,
        prizeAmount: 0
      })
    }
  })
  
  return positions
}

export async function resolveDispute(
  disputeId: string,
  winnerId: string,
  adminNotes: string
) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const { data: dispute } = await supabase
    .from('disputes')
    .select('*, matches(*)')
    .eq('id', disputeId)
    .single()

  if (!dispute) {
    return { error: 'Dispute not found' }
  }

  // Update dispute
  await supabase
    .from('disputes')
    .update({
      status: 'resolved',
      resolved_by: user.id,
      resolved_at: new Date().toISOString(),
      admin_notes: adminNotes,
    })
    .eq('id', disputeId)

  // Update match
  await supabase
    .from('matches')
    .update({
      status: 'completed',
      winner_id: winnerId,
      completed_at: new Date().toISOString(),
    })
    .eq('id', dispute.match_id)

  // Advance winner
  await advanceToNextRound(
    dispute.match_id,
    winnerId
  )

  revalidatePath('/admin/disputes')
  revalidatePath(`/admin/disputes/${disputeId}`)

  return { success: true }
}

