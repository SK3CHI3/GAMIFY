import { Trophy, Target, TrendingUp, DollarSign } from 'lucide-react'
import { Tables } from '@/lib/database.types'

export function StatsOverview({ stats }: { stats: Tables<'player_stats'> | null | undefined }) {
  const statCards = [
    {
      label: 'Tournaments',
      value: stats?.tournaments_played || 0,
      icon: Trophy,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
    },
    {
      label: 'Wins',
      value: stats?.tournaments_won || 0,
      icon: Target,
      gradient: 'from-teal-500 to-cyan-600',
      bgGradient: 'from-teal-50 to-cyan-50',
    },
    {
      label: 'Win Rate',
      value: `${stats?.win_rate || 0}%`,
      icon: TrendingUp,
      gradient: 'from-emerald-600 to-emerald-500',
      bgGradient: 'from-emerald-50 to-emerald-100',
    },
    {
      label: 'Earnings',
      value: `KES ${stats?.total_earnings || 0}`,
      icon: DollarSign,
      gradient: 'from-teal-600 to-emerald-600',
      bgGradient: 'from-teal-50 to-emerald-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <div 
            key={stat.label} 
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 font-medium">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}

