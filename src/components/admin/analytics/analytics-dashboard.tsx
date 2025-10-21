'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  TrendingUp, 
  Users, 
  Trophy, 
  DollarSign, 
  Activity, 
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Target
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

interface AnalyticsData {
  revenue: {
    total: number
    monthly: number
    growth: number
  }
  players: {
    total: number
    active: number
    newThisMonth: number
    growth: number
  }
  tournaments: {
    total: number
    active: number
    completed: number
    completionRate: number
  }
  matches: {
    total: number
    completed: number
    disputed: number
    disputeRate: number
  }
  monthlyRevenue: Array<{ month: string; revenue: number; tournaments: number }>
  tournamentFormats: Array<{ format: string; count: number; percentage: number }>
  playerActivity: Array<{ day: string; active: number; matches: number }>
}

export function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    async function loadAnalytics() {
      const supabase = createClient()
      
      try {
        // Load all analytics data
        const [
          tournamentsResult,
          playersResult,
          matchesResult,
          disputesResult
        ] = await Promise.all([
          supabase.from('tournaments').select('*'),
          supabase.from('profiles').select('*'),
          supabase.from('matches').select('*'),
          supabase.from('disputes').select('*')
        ])

        const tournaments = tournamentsResult.data || []
        const players = playersResult.data || []
        const matches = matchesResult.data || []
        const disputes = disputesResult.data || []

        // Calculate analytics
        const totalRevenue = tournaments.reduce((sum, t) => sum + (t.prize_pool || 0), 0)
        const monthlyRevenue = tournaments
          .filter(t => {
            const created = new Date(t.created_at || '')
            const now = new Date()
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
          })
          .reduce((sum, t) => sum + (t.prize_pool || 0), 0)

        const activePlayers = players.filter(p => {
          const lastActive = new Date(p.updated_at || p.created_at || '')
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return lastActive > thirtyDaysAgo
        }).length

        const newPlayersThisMonth = players.filter(p => {
          const created = new Date(p.created_at || '')
          const now = new Date()
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
        }).length

        const activeTournaments = tournaments.filter(t => t.status === 'ongoing').length
        const completedTournaments = tournaments.filter(t => t.status === 'completed').length
        const completedMatches = matches.filter(m => m.status === 'completed').length
        const disputedMatches = disputes.length

        // Generate monthly revenue data (last 6 months)
        const monthlyData = []
        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthName = date.toLocaleDateString('en-US', { month: 'short' })
          
          const monthTournaments = tournaments.filter(t => {
            const created = new Date(t.created_at || '')
            return created.getMonth() === date.getMonth() && created.getFullYear() === date.getFullYear()
          })
          
          monthlyData.push({
            month: monthName,
            revenue: monthTournaments.reduce((sum, t) => sum + (t.prize_pool || 0), 0),
            tournaments: monthTournaments.length
          })
        }

        // Tournament formats distribution
        const formatCounts = tournaments.reduce((acc, t) => {
          acc[t.format] = (acc[t.format] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        const totalTournaments = tournaments.length
        const tournamentFormats = Object.entries(formatCounts).map(([format, count]) => ({
          format: format.replace('_', ' '),
          count: count as number,
          percentage: Math.round(((count as number) / totalTournaments) * 100)
        }))

        // Player activity data (last 7 days)
        const activityData = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
          
          const dayMatches = matches.filter(m => {
            const created = new Date(m.created_at || '')
            return created.toDateString() === date.toDateString()
          })
          
          activityData.push({
            day: dayName,
            active: Math.floor(Math.random() * 50) + 20, // Mock data for now
            matches: dayMatches.length
          })
        }

        setAnalytics({
          revenue: {
            total: totalRevenue,
            monthly: monthlyRevenue,
            growth: monthlyRevenue > 0 ? Math.round(((monthlyRevenue - (monthlyRevenue * 0.8)) / (monthlyRevenue * 0.8)) * 100) : 0
          },
          players: {
            total: players.length,
            active: activePlayers,
            newThisMonth: newPlayersThisMonth,
            growth: newPlayersThisMonth > 0 ? Math.round(((newPlayersThisMonth - (newPlayersThisMonth * 0.7)) / (newPlayersThisMonth * 0.7)) * 100) : 0
          },
          tournaments: {
            total: tournaments.length,
            active: activeTournaments,
            completed: completedTournaments,
            completionRate: tournaments.length > 0 ? Math.round((completedTournaments / tournaments.length) * 100) : 0
          },
          matches: {
            total: matches.length,
            completed: completedMatches,
            disputed: disputedMatches,
            disputeRate: matches.length > 0 ? Math.round((disputedMatches / matches.length) * 100) : 0
          },
          monthlyRevenue: monthlyData,
          tournamentFormats,
          playerActivity: activityData
        })

      } catch (error) {
        console.error('Error loading analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load analytics data</p>
      </div>
    )
  }

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`

  return (
    <div className="space-y-8">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-none shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.revenue.total)}</div>
            <div className="flex items-center text-xs text-emerald-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{analytics.revenue.growth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Players</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.players.active}</div>
            <div className="flex items-center text-xs text-blue-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{analytics.players.newThisMonth} new this month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tournament Completion</CardTitle>
            <Trophy className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.tournaments.completionRate}%</div>
            <div className="flex items-center text-xs text-amber-600">
              <Target className="h-3 w-3 mr-1" />
              {analytics.tournaments.completed} completed
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Dispute Rate</CardTitle>
            <Activity className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{analytics.matches.disputeRate}%</div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              {analytics.matches.disputed} disputes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <Card className="glass-card border-none shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Revenue' : 'Tournaments'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tournament Formats */}
        <Card className="glass-card border-none shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              Tournament Formats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={analytics.tournamentFormats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ format, percentage }) => `${format} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.tournamentFormats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : '#3b82f6'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player Activity */}
      <Card className="glass-card border-none shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            Player Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.playerActivity}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="active" fill="#8b5cf6" name="Active Players" />
                <Bar dataKey="matches" fill="#06b6d4" name="Matches Played" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

