import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { Tables } from '@/lib/database.types'

export function RecentTournaments({ tournaments }: { tournaments: Tables<'tournaments'>[] }) {
  const statusColors = {
    registration: 'bg-blue-500',
    ongoing: 'bg-[#00FF88]',
    completed: 'bg-gray-500',
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Recent Tournaments</h2>
        <Link href="/admin/tournaments">
          <Button variant="ghost" size="sm">
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <Link key={tournament.id} href={`/admin/tournaments/${tournament.id}`}>
              <div className="p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-all animate-smooth cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{tournament.name}</h3>
                  <Badge className={statusColors[tournament.status as keyof typeof statusColors]}>
                    {tournament.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{tournament.current_players}/{tournament.max_slots} players</span>
                  <span>KES {tournament.prize_pool || 0} prize</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-600 py-8">No tournaments yet</p>
        )}
      </div>
    </div>
  )
}

