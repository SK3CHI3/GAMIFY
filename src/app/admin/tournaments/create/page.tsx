import { CreateTournamentForm } from '@/components/admin/create-tournament-form'
import { getCurrentUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'

export default async function CreateTournamentPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold gradient-text">Create Tournament</h1>
        <p className="text-gray-600 mt-2">Set up a new eFootball tournament for players to compete in</p>
      </div>

      <CreateTournamentForm />
    </div>
  )
}

