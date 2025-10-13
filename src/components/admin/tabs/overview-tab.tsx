'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminStats } from '@/components/admin/admin-stats'
import { AdminHeader } from '@/components/admin/admin-header'
import { RecentTournaments } from '@/components/admin/recent-tournaments'
import { DisputesPanel } from '@/components/admin/disputes-panel'
import { Loader2 } from 'lucide-react'

export function OverviewTab() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalTournaments: 0,
    totalPlayers: 0,
    activeTournaments: 0,
    pendingDisputes: 0,
  })
  const [recentTournaments, setRecentTournaments] = useState<any[]>([])
  const [disputes, setDisputes] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      // Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setUser(profile)

      // Fetch dashboard data
      const [
        { count: totalTournaments },
        { count: totalPlayers },
        { count: activeTournaments },
        { count: pendingDisputes },
        { data: tournamentsData },
        { data: disputesData },
      ] = await Promise.all([
        supabase.from('tournaments').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'player'),
        supabase.from('tournaments').select('*', { count: 'exact', head: true }).eq('status', 'ongoing'),
        supabase.from('disputes').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('tournaments').select('*').order('created_at', { ascending: false }).limit(5),
        supabase
          .from('disputes')
          .select('*, matches(*, tournament_id, player1_id, player2_id)')
          .eq('status', 'pending')
          .limit(10),
      ])

      setStats({
        totalTournaments: totalTournaments || 0,
        totalPlayers: totalPlayers || 0,
        activeTournaments: activeTournaments || 0,
        pendingDisputes: pendingDisputes || 0,
      })

      setRecentTournaments(tournamentsData || [])
      setDisputes(disputesData || [])
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <AdminHeader user={user} />

      <AdminStats stats={stats} />

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentTournaments tournaments={recentTournaments} />
        <DisputesPanel disputes={disputes} />
      </div>
    </div>
  )
}

