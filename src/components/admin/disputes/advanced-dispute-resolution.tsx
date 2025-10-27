'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  AlertCircle, 
  Eye, 
  CheckCircle, 
  Clock, 
  Image as ImageIcon,
  Flag,
  Shield,
  Calendar,
  DollarSign,
  Target
} from 'lucide-react'
import { format } from 'date-fns'

interface Dispute {
  id: string
  status: string
  created_at: string
  admin_notes: string
  resolved_at: string
  resolved_by: string
  match: {
    id: string
    player1_id: string
    player2_id: string
    player1_name: string
    player2_name: string
    player1_score: number
    player2_score: number
    player1_screenshot: string
    player2_screenshot: string
    tournament: {
      name: string
      prize_pool: number
    }
  }
}

interface DisputeStats {
  total: number
  pending: number
  resolved: number
  avgResolutionTime: number
  commonIssues: Array<{ issue: string; count: number }>
  resolutionTrend: Array<{ month: string; resolved: number; pending: number }>
}

export function AdvancedDisputeResolution() {
  const [loading, setLoading] = useState(true)
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [stats, setStats] = useState<DisputeStats | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')

  useEffect(() => {
    async function loadDisputes() {
      const supabase = createClient()
      
      try {
        const { data: disputesData, error } = await supabase
          .from('disputes')
          .select(`
            *,
            matches (
              *,
              player1:player1_id(full_name),
              player2:player2_id(full_name),
              tournaments(name, prize_pool)
            )
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        setDisputes(disputesData || [])

        // Calculate stats
        const total = disputesData?.length || 0
        const pending = disputesData?.filter(d => d.status === 'pending').length || 0
        const resolved = disputesData?.filter(d => d.status === 'resolved').length || 0
        
        // Mock stats for now
        setStats({
          total,
          pending,
          resolved,
          avgResolutionTime: 2.5, // hours
          commonIssues: [
            { issue: 'Score Mismatch', count: 15 },
            { issue: 'Screenshot Quality', count: 8 },
            { issue: 'Connection Issues', count: 5 },
            { issue: 'Rule Violations', count: 3 }
          ],
          resolutionTrend: [
            { month: 'Jan', resolved: 12, pending: 3 },
            { month: 'Feb', resolved: 18, pending: 5 },
            { month: 'Mar', resolved: 15, pending: 2 },
            { month: 'Apr', resolved: 22, pending: 4 },
            { month: 'May', resolved: 19, pending: 6 },
            { month: 'Jun', resolved: 25, pending: 3 }
          ]
        })

      } catch (error) {
        console.error('Error loading disputes:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDisputes()
  }, [])

  const handleResolveDispute = async (disputeId: string, winnerId: string) => {
    const supabase = createClient()
    
    try {
      const { error } = await supabase
        .from('disputes')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
          admin_notes: adminNotes
        })
        .eq('id', disputeId)

      if (error) throw error

      // Update match
      await supabase
        .from('matches')
        .update({
          status: 'completed',
          winner_id: winnerId,
          completed_at: new Date().toISOString()
        })
        .eq('id', selectedDispute?.match.id)

      // Refresh data
      window.location.reload()
    } catch (error) {
      console.error('Error resolving dispute:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 border-red-300 text-red-800'
      case 'resolved': return 'bg-green-100 border-green-300 text-green-800'
      case 'escalated': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      default: return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle
      case 'resolved': return CheckCircle
      case 'escalated': return Flag
      default: return Clock
    }
  }

  const filteredDisputes = disputes.filter(dispute => {
    if (filterStatus === 'all') return true
    return dispute.status === filterStatus
  })

  const sortedDisputes = [...filteredDisputes].sort((a, b) => {
    switch (sortBy) {
      case 'created_at':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'status':
        return a.status.localeCompare(b.status)
      case 'tournament':
        return a.match.tournament.name.localeCompare(b.match.tournament.name)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="glass-card border-none shadow-premium">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Disputes List Skeleton */}
        <Card className="glass-card border-none shadow-premium">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-none shadow-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Disputes</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-red-600">{stats?.pending || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{stats?.resolved || 0}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none shadow-premium">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Resolution</p>
                <p className="text-2xl font-bold text-amber-600">{stats?.avgResolutionTime || 0}h</p>
              </div>
              <Target className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card border-none shadow-premium">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="created_at">Newest</option>
                <option value="status">Status</option>
                <option value="tournament">Tournament</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disputes List */}
      <div className="grid gap-6">
        {sortedDisputes.map((dispute) => {
          const StatusIcon = getStatusIcon(dispute.status)
          
          return (
            <Card key={dispute.id} className="glass-card border-none shadow-premium hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <StatusIcon className="h-6 w-6 text-gray-600" />
                    <div>
                      <h3 className="font-bold text-gray-900">{dispute.match.tournament.name}</h3>
                      <p className="text-sm text-gray-600">
                        {dispute.match.player1_name} vs {dispute.match.player2_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(dispute.status)}>
                      {dispute.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDispute(dispute)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {dispute.match.player1_score} - {dispute.match.player2_score}
                    </div>
                    <div className="text-sm text-gray-600">Reported Scores</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="text-lg font-bold text-gray-900">
                      KES {dispute.match.tournament.prize_pool?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Prize Pool</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-lg font-bold text-gray-900">
                      {format(new Date(dispute.created_at), 'MMM d')}
                    </div>
                    <div className="text-sm text-gray-600">Created</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-amber-600" />
                    <div className="text-lg font-bold text-gray-900">
                      {Math.floor((Date.now() - new Date(dispute.created_at).getTime()) / (1000 * 60 * 60))}h
                    </div>
                    <div className="text-sm text-gray-600">Age</div>
                  </div>
                </div>

                {dispute.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                      onClick={() => handleResolveDispute(dispute.id, dispute.match.player1_id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Favor {dispute.match.player1_name}
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white"
                      onClick={() => handleResolveDispute(dispute.id, dispute.match.player2_id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Favor {dispute.match.player2_name}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4 mr-1" />
                      Escalate
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Dispute Detail Modal */}
      {selectedDispute && (
        <Card className="glass-card border-none shadow-premium">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Dispute Resolution</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDispute(null)}>
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Match Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-gray-900">Player 1: {selectedDispute.match.player1_name}</h4>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {selectedDispute.match.player1_score}
                  </div>
                  <p className="text-sm text-gray-600">Reported Score</p>
                </div>
                {selectedDispute.match.player1_screenshot && (
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      View Screenshot
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-gray-900">Player 2: {selectedDispute.match.player2_name}</h4>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {selectedDispute.match.player2_score}
                  </div>
                  <p className="text-sm text-gray-600">Reported Score</p>
                </div>
                {selectedDispute.match.player2_screenshot && (
                  <div className="text-center">
                    <Button variant="outline" size="sm">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      View Screenshot
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Admin Notes</label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about the resolution..."
                rows={3}
              />
            </div>

            {/* Resolution Actions */}
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                onClick={() => handleResolveDispute(selectedDispute.id, selectedDispute.match.player1_id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolve in Favor of {selectedDispute.match.player1_name}
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white"
                onClick={() => handleResolveDispute(selectedDispute.id, selectedDispute.match.player2_id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Resolve in Favor of {selectedDispute.match.player2_name}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sortedDisputes.length === 0 && (
        <Card className="glass-card border-none shadow-premium">
          <CardContent className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Disputes Found</h3>
            <p className="text-gray-600">All disputes have been resolved or no disputes match your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

