import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Users, Trophy } from 'lucide-react'
import { Tables } from '@/lib/database.types'

export function RecentTournaments({ tournaments }: { tournaments: Tables<'tournaments'>[] }) {
  const statusColors = {
    registration: 'bg-blue-600',
    ongoing: 'bg-green-600',
    completed: 'bg-gray-600',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Tournaments</h2>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          View All <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="space-y-3">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <div key={tournament.id} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{tournament.name}</h3>
                <Badge className={`${statusColors[tournament.status as keyof typeof statusColors]} text-white text-xs`}>
                  {tournament.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {tournament.current_players}/{tournament.max_slots}
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  KES {tournament.prize_pool || 0}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-700 font-medium">No tournaments yet</p>
            <p className="text-sm text-gray-500 mt-1">Create your first tournament to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

