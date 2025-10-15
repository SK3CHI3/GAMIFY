import { Trophy, DollarSign } from 'lucide-react'
import { Tables } from '@/lib/database.types'

export function StatsOverview({ stats }: { stats: Tables<'player_stats'> | null | undefined }) {
  const statCards = [
    {
      label: 'Tournaments',
      value: stats?.tournaments_played || 0,
      icon: Trophy,
    },
    {
      label: 'Earnings',
      value: `KES ${stats?.total_earnings || 0}`,
      icon: DollarSign,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        const bgColors = [
          'bg-blue-50',
          'bg-yellow-50'
        ]
        const iconColors = [
          'bg-blue-500',
          'bg-yellow-500'
        ]
        return (
          <div 
            key={stat.label} 
            className={`${bgColors[index]} backdrop-blur-sm border border-blue-200/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all group hover:border-blue-300`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-700 font-medium">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl ${iconColors[index]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
            </div>
          </div>
        )
      })}
    </div>
  )
}

