'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from './auth'
import { generateSingleEliminationBracket, generateDoubleEliminationBracket } from '@/lib/bracket-generator'

export async function createTournament(data: {
  name: string
  description?: string
  entry_fee: string
  max_slots: string
  format: string
  mode: string
  start_date?: string
  poster_url?: string
}) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  const entryFee = parseFloat(data.entry_fee)
  const maxSlots = parseInt(data.max_slots)
  const prizePool = entryFee * maxSlots

  const { data: tournament, error } = await supabase
    .from('tournaments')
    .insert({
      name: data.name,
      description: data.description || null,
      entry_fee: entryFee,
      prize_pool: prizePool,
      format: data.format,
      mode: data.mode,
      max_slots: maxSlots,
      created_by: user.id,
      start_date: data.start_date || null,
      poster_url: data.poster_url || null,
      status: 'registration',
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/tournaments')
  revalidatePath('/dashboard')
  
  return { success: true, tournament }
}

export async function registerForTournament(tournamentId: string) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) {
    return { error: 'You must be logged in to register' }
  }

  // Check if tournament exists and is accepting registrations
  const { data: tournament, error: tournamentError } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single()

  if (tournamentError || !tournament) {
    return { error: 'Tournament not found' }
  }

  if (tournament.status !== 'registration') {
    return { error: 'Tournament is not accepting registrations' }
  }

  // Check if already registered
  const { data: existing } = await supabase
    .from('registrations')
    .select('id')
    .eq('tournament_id', tournamentId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    return { error: 'You are already registered for this tournament' }
  }

  // Count current registrations
  const { count: currentPlayers } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('tournament_id', tournamentId)
    .eq('status', 'confirmed')

  // Determine status (confirmed or waitlist)
  const status = (currentPlayers || 0) < tournament.max_slots ? 'confirmed' : 'waitlist'

  const { error: insertError } = await supabase
    .from('registrations')
    .insert({
      tournament_id: tournamentId,
      user_id: user.id,
      status,
      payment_status: 'pending', // Will be updated when M-PESA integration is complete
    })

  if (insertError) {
    return { error: insertError.message }
  }

  // Update tournament current_players count
  if (status === 'confirmed') {
    await supabase
      .from('tournaments')
      .update({ current_players: (currentPlayers || 0) + 1 })
      .eq('id', tournamentId)
  }

  revalidatePath(`/dashboard/tournaments/${tournamentId}`)
  revalidatePath('/dashboard')

  return { success: true, status }
}

export async function startTournament(tournamentId: string) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  // Get tournament details
  const { data: tournament, error: tournamentError } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single()

  if (tournamentError || !tournament) {
    return { error: 'Tournament not found' }
  }

  // Get confirmed players
  const { data: registrations } = await supabase
    .from('registrations')
    .select('user_id')
    .eq('tournament_id', tournamentId)
    .eq('status', 'confirmed')

  const players = registrations?.map(r => r.user_id) || []

  if (players.length < 2) {
    return { error: 'Need at least 2 players to start tournament' }
  }

  // Generate bracket based on tournament format
  const bracketResult = tournament.format === 'single_elimination'
    ? generateSingleEliminationBracket(players)
    : generateDoubleEliminationBracket(players, tournamentId)

  // Insert matches into database
  for (const match of bracketResult.matches) {
    // If both players are assigned in round 1, set status to ongoing and add deadline
    const isRound1 = match.round === 1
    const hasBothPlayers = match.player1_id && match.player2_id
    
    let status = 'pending'
    let deadline = null
    
    if (isRound1 && hasBothPlayers) {
      status = 'ongoing'
      // Set deadline to 10 minutes from now for the match
      const deadlineDate = new Date()
      deadlineDate.setMinutes(deadlineDate.getMinutes() + 10)
      deadline = deadlineDate.toISOString()
    }

    const { error: matchError } = await supabase
      .from('matches')
      .insert({
        ...match,
        tournament_id: tournamentId,
        status,
        deadline,
      })

    if (matchError) {
      console.error('Error creating match:', matchError)
    }
  }

  // Update tournament status to ongoing
  const { error } = await supabase
    .from('tournaments')
    .update({ status: 'ongoing' })
    .eq('id', tournamentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/tournaments/${tournamentId}`)
  revalidatePath('/admin/dashboard')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function pauseTournament(tournamentId: string) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  // Check if tournament exists and is ongoing
  const { data: tournament, error: tournamentError } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single()

  if (tournamentError || !tournament) {
    return { error: 'Tournament not found' }
  }

  if (tournament.status !== 'ongoing') {
    return { error: 'Only ongoing tournaments can be paused' }
  }

  // Update tournament status to paused
  const { error } = await supabase
    .from('tournaments')
    .update({ status: 'paused' })
    .eq('id', tournamentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/tournaments/${tournamentId}`)
  revalidatePath('/admin/dashboard')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function resumeTournament(tournamentId: string) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  // Check if tournament exists and is paused
  const { data: tournament, error: tournamentError } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single()

  if (tournamentError || !tournament) {
    return { error: 'Tournament not found' }
  }

  if (tournament.status !== 'paused') {
    return { error: 'Only paused tournaments can be resumed' }
  }

  // Update tournament status back to ongoing
  const { error } = await supabase
    .from('tournaments')
    .update({ status: 'ongoing' })
    .eq('id', tournamentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/tournaments/${tournamentId}`)
  revalidatePath('/admin/dashboard')
  revalidatePath('/dashboard')

  return { success: true }
}

export async function deleteTournament(tournamentId: string) {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized' }
  }

  // Check if tournament exists
  const { data: tournament, error: tournamentError } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single()

  if (tournamentError || !tournament) {
    return { error: 'Tournament not found' }
  }

  // Prevent deletion of completed tournaments
  if (tournament.status === 'completed') {
    return { error: 'Cannot delete completed tournaments' }
  }

  // Delete the tournament (cascade will handle related data)
  const { error } = await supabase
    .from('tournaments')
    .delete()
    .eq('id', tournamentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/tournaments')
  revalidatePath('/admin/dashboard')
  revalidatePath('/dashboard')

  return { success: true }
}

