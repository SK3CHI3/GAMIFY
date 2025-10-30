'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TournamentCard } from '@/components/tournaments/tournament-card'
import { PlayerHeader } from '@/components/dashboard/player-header'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { Skeleton } from '@/components/ui/skeleton'

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
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Player Header Skeleton */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* Stats Overview Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
          ))}
        </div>

        {/* Tournaments Skeleton */}
        <section className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4 mb-4">
                  <Skeleton className="h-24 w-24 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </section>
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

