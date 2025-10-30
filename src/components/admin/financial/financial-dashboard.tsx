'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  TrendingUp,
  CreditCard,
  Wallet,
  PieChart,
  Calendar,
  Download,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Trophy,
  Zap
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

interface FinancialData {
  revenue: {
    total: number
    monthly: number
    weekly: number
    daily: number
    growth: number
  }
  expenses: {
    total: number
    platform_fees: number
    payment_processing: number
    operational: number
  }
  payouts: {
    total: number
    pending: number
    completed: number
    failed: number
  }
  transactions: {
    total: number
    successful: number
    failed: number
    pending: number
  }
  monthlyRevenue: Array<{ month: string; revenue: number; tournaments: number; players: number }>
  paymentMethods: Array<{ method: string; count: number; percentage: number; amount: number }>
  topEarners: Array<{ player: string; earnings: number; tournaments: number }>
  recentTransactions: Array<{ id: string; type: string; amount: number; status: string; date: string; player: string }>
}

export function FinancialDashboard() {
  const [loading, setLoading] = useState(true)
  const [financial, setFinancial] = useState<FinancialData | null>(null)
  const [timeRange] = useState('30d')

  useEffect(() => {
    async function loadFinancialData() {
      const supabase = createClient()
      
      try {
        const [
          tournamentsResult,
          registrationsResult,
          profilesResult
        ] = await Promise.all([
          supabase.from('tournaments').select('*'),
          supabase.from('registrations').select('*'),
          supabase.from('profiles').select('*')
        ])

        const tournaments = tournamentsResult.data || []
        const registrations = registrationsResult.data || []
        const profiles = profilesResult.data || []

        // Calculate revenue
        const totalRevenue = tournaments.reduce((sum, t) => sum + (t.prize_pool || 0), 0)
        const entryFees = tournaments.reduce((sum, t) => sum + (t.entry_fee * (t.current_players || 0)), 0)
        
        // Calculate monthly revenue
        const now = new Date()
        const currentMonth = tournaments.filter(t => {
          const created = new Date(t.created_at || '')
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
        })
        const monthlyRevenue = currentMonth.reduce((sum, t) => sum + (t.prize_pool || 0), 0)

        // Calculate expenses (mock data for now)
        const platformFees = totalRevenue * 0.05 // 5% platform fee
        const paymentProcessing = entryFees * 0.03 // 3% payment processing
        const operational = totalRevenue * 0.02 // 2% operational costs

        // Calculate payouts
        const completedTournaments = tournaments.filter(t => t.status === 'completed')
        const totalPayouts = completedTournaments.reduce((sum, t) => sum + (t.prize_pool || 0), 0)

        // Generate monthly revenue data
        const monthlyData = []
        for (let i = 11; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthName = date.toLocaleDateString('en-US', { month: 'short' })
          
          const monthTournaments = tournaments.filter(t => {
            const created = new Date(t.created_at || '')
            return created.getMonth() === date.getMonth() && created.getFullYear() === date.getFullYear()
          })
          
          const monthPlayers = registrations.filter(r => {
            const created = new Date(r.created_at || '')
            return created.getMonth() === date.getMonth() && created.getFullYear() === date.getFullYear()
          }).length
          
          monthlyData.push({
            month: monthName,
            revenue: monthTournaments.reduce((sum, t) => sum + (t.prize_pool || 0), 0),
            tournaments: monthTournaments.length,
            players: monthPlayers
          })
        }

        // Payment methods distribution (mock data)
        const paymentMethods = [
          { method: 'M-PESA', count: 150, percentage: 75, amount: 45000 },
          { method: 'Bank Transfer', count: 30, percentage: 15, amount: 9000 },
          { method: 'Card', count: 20, percentage: 10, amount: 6000 }
        ]

        // Top earners - limit to 3
        const topEarners = profiles
          .map(p => {
            const playerTournaments = registrations.filter(r => r.user_id === p.id)
            const earnings = playerTournaments.reduce((sum, r) => {
              const tournament = tournaments.find(t => t.id === r.tournament_id)
              return sum + (tournament?.prize_pool || 0) * 0.6 // Assuming 60% for winners
            }, 0)
            return {
              player: p.full_name,
              earnings,
              tournaments: playerTournaments.length
            }
          })
          .sort((a, b) => b.earnings - a.earnings)
          .slice(0, 3)

        // Recent transactions - limit to 3
        const recentTransactions = [
          { id: '1', type: 'Entry Fee', amount: 500, status: 'completed', date: new Date().toISOString(), player: 'John Doe' },
          { id: '2', type: 'Prize Payout', amount: 1500, status: 'pending', date: new Date(Date.now() - 86400000).toISOString(), player: 'Jane Smith' },
          { id: '3', type: 'Entry Fee', amount: 300, status: 'completed', date: new Date(Date.now() - 172800000).toISOString(), player: 'Mike Johnson' }
        ]

        setFinancial({
          revenue: {
            total: totalRevenue,
            monthly: monthlyRevenue,
            weekly: monthlyRevenue / 4,
            daily: monthlyRevenue / 30,
            growth: 15.2
          },
          expenses: {
            total: platformFees + paymentProcessing + operational,
            platform_fees: platformFees,
            payment_processing: paymentProcessing,
            operational: operational
          },
          payouts: {
            total: totalPayouts,
            pending: totalPayouts * 0.2,
            completed: totalPayouts * 0.8,
            failed: 0
          },
          transactions: {
            total: registrations.length,
            successful: Math.floor(registrations.length * 0.95),
            failed: Math.floor(registrations.length * 0.03),
            pending: Math.floor(registrations.length * 0.02)
          },
          monthlyRevenue: monthlyData,
          paymentMethods,
          topEarners,
          recentTransactions
        })

      } catch (error) {
        console.error('Error loading financial data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFinancialData()
  }, [timeRange])

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle
      case 'pending': return Clock
      case 'failed': return AlertCircle
      default: return Clock
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-card border-none shadow-premium">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="glass-card border-none shadow-premium">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!financial) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load financial data</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-none shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(financial.revenue.total)}</div>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{financial.revenue.growth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(financial.revenue.monthly)}</div>
            <div className="flex items-center text-xs text-blue-600">
              <Target className="h-3 w-3 mr-1" />
              This month
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Payouts</CardTitle>
            <Wallet className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(financial.payouts.total)}</div>
            <div className="flex items-center text-xs text-amber-600">
              <Zap className="h-3 w-3 mr-1" />
              {formatCurrency(financial.payouts.pending)} pending
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {Math.round((financial.transactions.successful / financial.transactions.total) * 100)}%
            </div>
            <div className="flex items-center text-xs text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              {financial.transactions.successful} successful
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
              Revenue Trend (12 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financial.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(Number(value)) : value,
                      name === 'revenue' ? 'Revenue' : name === 'tournaments' ? 'Tournaments' : 'Players'
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

        {/* Payment Methods */}
        <Card className="glass-card border-none shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={financial.paymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ method, percentage }) => `${method} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {financial.paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#3b82f6' : '#f59e0b'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [
                    formatCurrency(Number(value)),
                    'Amount'
                  ]} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Earners and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Earners */}
        <Card className="glass-card border-none shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              Top Earners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financial.topEarners.map((earner, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{earner.player}</p>
                      <p className="text-sm text-gray-600">{earner.tournaments} tournaments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{formatCurrency(earner.earnings)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="glass-card border-none shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {financial.recentTransactions.map((transaction) => {
                const StatusIcon = getStatusIcon(transaction.status)
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <StatusIcon className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{transaction.type}</p>
                        <p className="text-sm text-gray-600">{transaction.player}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
                      <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30">
          <Download className="h-4 w-4 mr-2" />
          Export Financial Report
        </Button>
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          View Detailed Analytics
        </Button>
      </div>
    </div>
  )
}

