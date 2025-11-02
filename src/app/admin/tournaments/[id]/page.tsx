import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/app/actions/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { AdminTournamentDetailClient } from '@/components/admin/tournaments/admin-tournament-detail-client'

export default async function AdminTournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/')
  }

  const { id: tournamentId } = await params

  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', tournamentId)
    .single()

  if (error || !tournament) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Tournament Details</h1>
      </div>
      <AdminTournamentDetailClient tournament={tournament} />
    </div>
  )
}

