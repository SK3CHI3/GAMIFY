'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminStats } from '@/components/admin/admin-stats'
import { RecentTournaments } from '@/components/admin/recent-tournaments'
import { DisputesPanel } from '@/components/admin/disputes-panel'
import { Skeleton } from '@/components/ui/skeleton'

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
      <div className="space-y-6">
        {/* Welcome Section Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>

        {/* Panels Skeleton */}
        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-20" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.full_name || 'Admin'}</h1>
            <p className="text-gray-600">Here's what's happening with your platform today.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last login</p>
            <p className="text-base font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <AdminStats stats={stats} />

      {/* Recent Activity Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RecentTournaments tournaments={recentTournaments} />
        <DisputesPanel disputes={disputes} />
      </div>
    </div>
  )
}

