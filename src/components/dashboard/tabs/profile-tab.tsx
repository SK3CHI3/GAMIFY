'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Trophy, Target, TrendingUp, DollarSign, Calendar, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

export function ProfileTab() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])

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

      // Fetch tournament history
      const { data: registrationsData } = await supabase
        .from('registrations')
        .select('*, tournaments(*)')
        .eq('user_id', authUser.id)
        .order('registered_at', { ascending: false })

      setRegistrations(registrationsData || [])

      // Fetch match history
      const { data: matchesData } = await supabase
        .from('matches')
        .select(`
          *,
          player1:player1_id(full_name),
          player2:player2_id(full_name),
          tournaments(name)
        `)
        .or(`player1_id.eq.${authUser.id},player2_id.eq.${authUser.id}`)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(10)

      setMatches(matchesData || [])
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

  const stats = user?.player_stats || {}

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      {/* Profile Header */}
      <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="w-28 h-28 border-4 border-white shadow-xl">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-3xl font-bold">
                {user?.full_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white shadow-lg" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{user?.full_name}</h1>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500">{user?.phone}</p>
            <div className="flex gap-2 justify-center md:justify-start mt-4">
              <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50">
                Player
              </Badge>
              <Badge variant="outline" className="border-gray-300 bg-white">
                Joined {format(new Date(user?.created_at || ''), 'MMM yyyy')}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg group hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 font-medium">Tournaments</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{stats.tournaments_played || 0}</p>
        </div>

        <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg group hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 font-medium">Wins</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent">{stats.tournaments_won || 0}</p>
        </div>

        <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg group hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 font-medium">Win Rate</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">{stats.win_rate || 0}%</p>
        </div>

        <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg group hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600 font-medium">Earnings</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">KES {stats.total_earnings || 0}</p>
        </div>
      </div>

      {/* Tournament History */}
      <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          <Trophy className="w-6 h-6 text-emerald-600" />
          Tournament History
        </h2>

        <div className="space-y-3">
          {registrations.length > 0 ? (
            registrations.map((reg: any) => (
              <div 
                key={reg.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-xl border border-white/60 hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{reg.tournaments.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(reg.registered_at), 'MMM d, yyyy')}
                    </span>
                    <span>Entry: KES {reg.tournaments.entry_fee}</span>
                    {reg.prize_amount && (
                      <span className="text-emerald-600 font-semibold">
                        Won: KES {reg.prize_amount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {reg.position_finished && (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                      #{reg.position_finished}
                    </Badge>
                  )}
                  <Badge 
                    variant={reg.status === 'eliminated' ? 'destructive' : 'default'}
                    className={reg.status === 'confirmed' ? 'bg-emerald-500' : ''}
                  >
                    {reg.status}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-8">
              No tournament history yet. Join your first tournament!
            </p>
          )}
        </div>
      </div>

      {/* Recent Matches */}
      <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Recent Matches</h2>

        <div className="space-y-3">
          {matches.length > 0 ? (
            matches.map((match: any) => {
              const isPlayer1 = match.player1_id === user.id
              const opponent = isPlayer1 ? match.player2 : match.player1
              const userScore = isPlayer1 ? match.player1_score : match.player2_score
              const opponentScore = isPlayer1 ? match.player2_score : match.player1_score
              const won = match.winner_id === user.id

              return (
                <div 
                  key={match.id}
                  className={`
                    p-4 rounded-xl border-2
                    ${won ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-300'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">{match.tournaments?.name}</p>
                      <p className="font-semibold text-gray-900">vs {opponent?.full_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {userScore} - {opponentScore}
                      </p>
                      <Badge className={won ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-red-500'}>
                        {won ? 'Won' : 'Lost'}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-gray-600 py-8">
              No match history yet
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

