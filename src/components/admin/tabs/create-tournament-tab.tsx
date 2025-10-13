'use client'

import { CreateTournamentForm } from '@/components/admin/create-tournament-form'
import { Plus } from 'lucide-react'

export function CreateTournamentTab() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
      <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Create Tournament
            </h1>
            <p className="text-gray-600 text-sm">Set up a new eFootball tournament for players to compete in</p>
          </div>
        </div>
      </div>

      <CreateTournamentForm />
    </div>
  )
}

