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

  const poster = (tournament as any).poster_url as string | undefined

  return (
    <Link href={`/dashboard/tournaments/${tournament.id}`}>
      <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer">
        {/* Poster Image */}
        {poster && (
          <div className="relative h-48 w-full overflow-hidden">
            <img 
              src={poster} 
              alt={tournament.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="space-y-2 flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#00FF88] transition-all">
                {tournament.name}
              </h3>
              {tournament.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{tournament.description}</p>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
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
            <Badge variant="outline" className="border-[#00FF88] text-[#00FF88] bg-[#00FF88]/10">
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
            <Trophy className="w-4 h-4 text-[#FFB800]" />
            <span className="font-bold text-[#00FF88]">
              KES {tournament.prize_pool || 0}
            </span>
          </div>
        </div>

        {!userRegistration && tournament.status === 'registration' && (
          <Button className="w-full gradient-primary text-white shadow-glow-green hover:shadow-glow-amber transition-all group/btn">
            <span className="flex items-center gap-2">
              Register Now
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </span>
          </Button>
        )}
      </div>
      </div>
    </Link>
  )
}
