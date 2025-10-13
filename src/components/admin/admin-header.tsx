import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from '@/app/actions/auth'
import { Tables } from '@/lib/database.types'

export function AdminHeader({ user }: { user: Tables<'profiles'> | null }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.full_name}</p>
        </div>

        <form action={signOut}>
          <Button variant="outline" type="submit">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}

