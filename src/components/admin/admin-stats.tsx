import { Trophy, Users, TrendingUp, AlertCircle } from 'lucide-react'

interface AdminStatsProps {
  stats: {
    totalTournaments: number
    totalPlayers: number
    activeTournaments: number
    pendingDisputes: number
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  const statCards = [
    {
      label: 'Total Tournaments',
      value: stats.totalTournaments,
      icon: Trophy,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Total Players',
      value: stats.totalPlayers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Active Tournaments',
      value: stats.activeTournaments,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Pending Disputes',
      value: stats.pendingDisputes,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

