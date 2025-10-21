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
    await verifyMatchResults(matchId)
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

  // Check if scores match
  if (player1_score === player2_score) {
    // Scores match - it's a draw, both submitted same score
    // Determine winner based on who scored more (or handle draw differently)
    // For now, we'll treat matching submissions as needing a winner
    // In a real scenario, you'd need business logic for handling draws
    return await createDispute(matchId, 'Draw situation - both players claim same score')
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
        await supabase
          .from('matches')
          .update({ status: 'ongoing' })
          .eq('id', nextMatch.id)
      }
    }
  }
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

