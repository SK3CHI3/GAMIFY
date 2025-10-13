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
      color: 'text-[#FFB800]',
      bgColor: 'bg-[#FFB800]/10',
    },
    {
      label: 'Total Players',
      value: stats.totalPlayers,
      icon: Users,
      color: 'text-[#00FF88]',
      bgColor: 'bg-[#00FF88]/10',
    },
    {
      label: 'Active Tournaments',
      value: stats.activeTournaments,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Pending Disputes',
      value: stats.pendingDisputes,
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

