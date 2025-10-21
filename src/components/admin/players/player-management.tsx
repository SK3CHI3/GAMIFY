'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Search, 
  MoreVertical, 
  Trophy, 
  Activity,
  Mail,
  Phone,
  Calendar,
  XCircle,
  Crown,
  Star
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'

interface Player {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  created_at: string
  updated_at: string
  stats?: {
    tournaments_played: number
    tournaments_won: number
    total_earnings: number
    win_rate: number
    dispute_count: number
    last_active: string
  }
}

export function PlayerManagement() {
  const [loading, setLoading] = useState(true)
  const [players, setPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [sortBy, setSortBy] = useState('created_at')

  useEffect(() => {
    async function loadPlayers() {
      const supabase = createClient()
      
      try {
        const { data: playersData, error } = await supabase
          .from('profiles')
          .select(`
            *,
            player_stats (
              tournaments_played,
              tournaments_won,
              total_earnings,
              last_active
            )
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Calculate additional stats
        const playersWithStats = await Promise.all(
          (playersData || []).map(async (player) => {
            // Get dispute count
            const { count: disputeCount } = await supabase
              .from('disputes')
              .select('*', { count: 'exact', head: true })
              .or(`player1_id.eq.${player.id},player2_id.eq.${player.id}`)

            const stats = player.player_stats?.[0]
            const tournamentsPlayed = stats?.tournaments_played || 0
            const tournamentsWon = stats?.tournaments_won || 0
            const winRate = tournamentsPlayed > 0 ? Math.round((tournamentsWon / tournamentsPlayed) * 100) : 0

            return {
              ...player,
              stats: {
                tournaments_played: tournamentsPlayed,
                tournaments_won: tournamentsWon,
                total_earnings: stats?.total_earnings || 0,
                win_rate: winRate,
                dispute_count: disputeCount || 0,
                last_active: stats?.last_active || player.updated_at
              }
            }
          })
        )

        setPlayers(playersWithStats)
      } catch (error) {
        console.error('Error loading players:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPlayers()
  }, [])

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || player.role === filterRole
    return matchesSearch && matchesRole
  })

  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.full_name.localeCompare(b.full_name)
      case 'earnings':
        return (b.stats?.total_earnings || 0) - (a.stats?.total_earnings || 0)
      case 'win_rate':
        return (b.stats?.win_rate || 0) - (a.stats?.win_rate || 0)
      case 'tournaments':
        return (b.stats?.tournaments_played || 0) - (a.stats?.tournaments_played || 0)
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const getPlayerRank = (player: Player) => {
    const earnings = player.stats?.total_earnings || 0
    if (earnings >= 10000) return { rank: 'Champion', icon: Crown, color: 'text-yellow-600' }
    if (earnings >= 5000) return { rank: 'Elite', icon: Star, color: 'text-purple-600' }
    if (earnings >= 1000) return { rank: 'Pro', icon: Trophy, color: 'text-blue-600' }
    return { rank: 'Rookie', icon: Activity, color: 'text-gray-600' }
  }

  const getStatusBadge = (player: Player) => {
    const lastActive = new Date(player.stats?.last_active || player.updated_at)
    const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceActive <= 7) return { status: 'Active', color: 'bg-green-500' }
    if (daysSinceActive <= 30) return { status: 'Inactive', color: 'bg-yellow-500' }
    return { status: 'Dormant', color: 'bg-red-500' }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Player Management
          </h1>
          <p className="text-gray-600 mt-1">Manage players, view statistics, and track performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-emerald-500 text-emerald-600">
            {players.length} Total Players
          </Badge>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="glass-card border-none shadow-premium">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search players by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="all">All Roles</option>
                <option value="player">Players</option>
                <option value="admin">Admins</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="created_at">Newest</option>
                <option value="name">Name</option>
                <option value="earnings">Earnings</option>
                <option value="win_rate">Win Rate</option>
                <option value="tournaments">Tournaments</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedPlayers.map((player) => {
          const rankInfo = getPlayerRank(player)
          const statusInfo = getStatusBadge(player)
          const RankIcon = rankInfo.icon

          return (
            <Card key={player.id} className="glass-card border-none shadow-premium hover:shadow-xl transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.full_name}`} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold">
                        {player.full_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-gray-900">{player.full_name}</h3>
                      <p className="text-sm text-gray-600">{player.email}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Activity className="h-4 w-4 mr-2" />
                        View Activity
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <XCircle className="h-4 w-4 mr-2" />
                        Suspend Player
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rank and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RankIcon className={`h-4 w-4 ${rankInfo.color}`} />
                    <span className={`text-sm font-medium ${rankInfo.color}`}>
                      {rankInfo.rank}
                    </span>
                  </div>
                  <Badge className={`${statusInfo.color} text-white`}>
                    {statusInfo.status}
                  </Badge>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {player.stats?.tournaments_played || 0}
                    </div>
                    <div className="text-xs text-gray-600">Tournaments</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">
                      {player.stats?.win_rate || 0}%
                    </div>
                    <div className="text-xs text-gray-600">Win Rate</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-amber-600">
                      KES {player.stats?.total_earnings?.toLocaleString() || 0}
                    </div>
                    <div className="text-xs text-gray-600">Earnings</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {player.stats?.dispute_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Disputes</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{player.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {format(new Date(player.created_at), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Activity className="h-4 w-4 mr-1" />
                    Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {sortedPlayers.length === 0 && (
        <Card className="glass-card border-none shadow-premium">
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Players Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

