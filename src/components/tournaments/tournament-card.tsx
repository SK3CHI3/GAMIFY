import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Users, Calendar, DollarSign, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import { Tables } from '@/lib/database.types'

export function TournamentCard({ 
  tournament, 
  userRegistration 
}: { 
  tournament: Tables<'tournaments'>
  userRegistration?: Tables<'registrations'> 
}) {
  const statusColors = {
    registration: 'bg-blue-500 text-white',
    ongoing: 'bg-emerald-500 text-white',
    completed: 'bg-gray-500 text-white',
  }

  const formatTypeColors = {
    single_elimination: 'bg-teal-500 text-white',
    double_elimination: 'bg-purple-500 text-white',
  }

  return (
    <Link href={`/dashboard/tournaments/${tournament.id}`}>
      <div className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2 flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
              {tournament.name}
            </h3>
            {tournament.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{tournament.description}</p>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={statusColors[tournament.status as keyof typeof statusColors]}>
            {tournament.status.replace('_', ' ')}
          </Badge>
          <Badge className={formatTypeColors[tournament.format as keyof typeof formatTypeColors]}>
            {tournament.format.replace('_', ' ')}
          </Badge>
          {userRegistration && (
            <Badge variant="outline" className="border-emerald-500 text-emerald-600 bg-emerald-50">
              Registered
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{tournament.current_players || 0} / {tournament.max_slots} players</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>KES {tournament.entry_fee}</span>
          </div>
          {tournament.start_date && (
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{format(new Date(tournament.start_date), 'MMM d, yyyy')}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              KES {tournament.prize_pool || 0}
            </span>
          </div>
        </div>

        {!userRegistration && tournament.status === 'registration' && (
          <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all group/btn">
            <span className="flex items-center gap-2">
              Register Now
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </Button>
        )}
      </div>
    </Link>
  )
}

