import { getCurrentUser } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-react'

export default async function DisputesPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    redirect('/')
  }

  const supabase = await createClient()

  const { data: disputes } = await supabase
    .from('disputes')
    .select(`
      *,
      matches (
        *,
        player1:player1_id(full_name),
        player2:player2_id(full_name),
        tournaments(name)
      )
    `)
    .order('created_at', { ascending: false })

  const pendingDisputes = disputes?.filter(d => d.status === 'pending') || []
  const resolvedDisputes = disputes?.filter(d => d.status === 'resolved') || []

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold gradient-text">Dispute Management</h1>
        <p className="text-gray-600 mt-2">Review and resolve match result disputes</p>
      </div>

      {/* Pending Disputes */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold mb-6">
          Pending Disputes ({pendingDisputes.length})
        </h2>

        <div className="space-y-4">
          {pendingDisputes.length > 0 ? (
            pendingDisputes.map((dispute: any) => (
              <Link key={dispute.id} href={`/admin/disputes/${dispute.id}`}>
                <div className="p-4 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">{dispute.matches.tournaments.name}</h3>
                        <Badge variant="destructive">Urgent</Badge>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="text-gray-700">
                          <strong>Match:</strong> {dispute.matches.player1?.full_name} vs{' '}
                          {dispute.matches.player2?.full_name}
                        </p>
                        <p className="text-gray-700">
                          <strong>Scores:</strong> {dispute.matches.player1_score} -{' '}
                          {dispute.matches.player2_score}
                        </p>
                        <p className="text-gray-600">
                          Created: {new Date(dispute.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8 space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-gray-600">No pending disputes</p>
            </div>
          )}
        </div>
      </div>

      {/* Resolved Disputes */}
      {resolvedDisputes.length > 0 && (
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-6">
            Recently Resolved ({resolvedDisputes.length})
          </h2>

          <div className="space-y-3">
            {resolvedDisputes.slice(0, 10).map((dispute: any) => (
              <div 
                key={dispute.id}
                className="p-4 rounded-lg bg-white/50"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">{dispute.matches.tournaments.name}</p>
                    <p className="text-sm text-gray-600">
                      {dispute.matches.player1?.full_name} vs {dispute.matches.player2?.full_name}
                    </p>
                  </div>
                  <Badge className="bg-green-500">Resolved</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

