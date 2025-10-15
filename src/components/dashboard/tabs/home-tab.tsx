'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TournamentCard } from '@/components/tournaments/tournament-card'
import { PlayerHeader } from '@/components/dashboard/player-header'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { Loader2 } from 'lucide-react'

export function HomeTab() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [tournaments, setTournaments] = useState<any[]>([])
  const [userRegistrations, setUserRegistrations] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) return

      // Fetch user profile with stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('*, player_stats(*)')
        .eq('id', authUser.id)
        .single()

      setUser(profile)

      // Fetch active tournaments
      const { data: tournamentsData } = await supabase
        .from('tournaments')
        .select('*')
        .in('status', ['registration', 'ongoing'])
        .order('created_at', { ascending: false })
        .limit(10)

      setTournaments(tournamentsData || [])

      // Fetch user's active registrations
      const { data: registrationsData } = await supabase
        .from('registrations')
        .select('*, tournaments(*)')
        .eq('user_id', authUser.id)
        .in('status', ['confirmed', 'waitlist'])

      setUserRegistrations(registrationsData || [])
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <PlayerHeader user={user} />
      
      <StatsOverview stats={user?.player_stats} />

      {/* My Tournaments */}
      {userRegistrations && userRegistrations.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">My Tournaments</h2>
          <div className="grid gap-4">
            {userRegistrations.map((reg) => (
              <TournamentCard key={reg.id} tournament={reg.tournaments} userRegistration={reg} />
            ))}
          </div>
        </section>
      )}

      {/* Available Tournaments */}
      <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Available Tournaments</h2>
        <div className="grid gap-4">
          {tournaments && tournaments.length > 0 ? (
            tournaments.slice(0, 5).map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-lg">
              <p className="text-gray-600 text-lg">No active tournaments at the moment.</p>
              <p className="text-sm mt-2 text-gray-500">Check back soon for new tournaments!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

