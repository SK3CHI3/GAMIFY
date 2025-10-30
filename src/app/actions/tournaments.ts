'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from './auth'

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
    .select('*, registrations(count)')
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

  // Determine status (confirmed or waitlist)
  const currentPlayers = tournament.current_players || 0
  const status = currentPlayers < tournament.max_slots ? 'confirmed' : 'waitlist'

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

  const { error } = await supabase
    .from('tournaments')
    .update({ status: 'ongoing' })
    .eq('id', tournamentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/tournaments/${tournamentId}`)
  revalidatePath('/admin/dashboard')

  return { success: true }
}

