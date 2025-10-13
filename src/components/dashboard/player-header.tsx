import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from '@/app/actions/auth'

import { Tables } from '@/lib/database.types'

type Profile = Tables<'profiles'> & {
  player_stats: Tables<'player_stats'> | null
}

export function PlayerHeader({ user }: { user: Profile | null }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl font-bold">
                {user?.full_name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.full_name}</h1>
            <p className="text-gray-600 text-sm">{user?.email}</p>
          </div>
        </div>

        <form action={signOut}>
          <Button 
            variant="outline" 
            size="icon" 
            type="submit"
            className="border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

