'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { AlertCircle, Loader2, X } from 'lucide-react'

export function DisputesManageTab() {
  const [loading, setLoading] = useState(true)
  const [disputes, setDisputes] = useState<any[]>([])
  const [selectedDispute, setSelectedDispute] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      const { data } = await supabase
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

      setDisputes(data || [])
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  const pendingDisputes = disputes.filter(d => d.status === 'pending')
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved')

  return (
    <>
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Dispute Management
              </h1>
              <p className="text-gray-600 text-sm">Review and resolve match result disputes</p>
            </div>
          </div>
        </div>

        {/* Pending Disputes */}
        <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-gray-900">
            Pending Disputes ({pendingDisputes.length})
          </h2>

          <div className="space-y-4">
            {pendingDisputes.length > 0 ? (
              pendingDisputes.map((dispute: any) => (
                <div 
                  key={dispute.id}
                  onClick={() => setSelectedDispute(dispute)}
                  className="p-4 rounded-xl bg-red-50 hover:bg-red-100 border-2 border-red-200 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-gray-900">{dispute.matches.tournaments.name}</h3>
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
              ))
            ) : (
              <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No Pending Disputes</h3>
                <p className="text-gray-600">All disputes have been resolved!</p>
              </div>
            )}
          </div>
        </div>

        {/* Resolved Disputes */}
        {resolvedDisputes.length > 0 && (
          <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              Recently Resolved ({resolvedDisputes.length})
            </h2>

            <div className="space-y-3">
              {resolvedDisputes.slice(0, 10).map((dispute: any) => (
                <div 
                  key={dispute.id}
                  onClick={() => setSelectedDispute(dispute)}
                  className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-900">{dispute.matches.tournaments.name}</p>
                      <p className="text-sm text-gray-600">
                        {dispute.matches.player1?.full_name} vs {dispute.matches.player2?.full_name}
                      </p>
                    </div>
                    <Badge className="bg-emerald-500">Resolved</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dispute Detail Modal */}
      <Dialog open={!!selectedDispute} onOpenChange={(open) => !open && setSelectedDispute(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedDispute && (
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Dispute Details</h2>
                  <Badge className={selectedDispute.status === 'pending' ? 'bg-red-500' : 'bg-emerald-500'}>
                    {selectedDispute.status}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedDispute(null)}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Match Information</h3>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Tournament:</strong> {selectedDispute.matches.tournaments.name}</p>
                  <p><strong>Player 1:</strong> {selectedDispute.matches.player1?.full_name}</p>
                  <p><strong>Player 2:</strong> {selectedDispute.matches.player2?.full_name}</p>
                  <p><strong>Reported Scores:</strong> {selectedDispute.matches.player1_score} - {selectedDispute.matches.player2_score}</p>
                  <p><strong>Created:</strong> {new Date(selectedDispute.created_at).toLocaleString()}</p>
                </div>
              </div>

              {selectedDispute.status === 'pending' && (
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-lg hover:shadow-emerald-500/30">
                    Resolve in Favor of Player 1
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-teal-500/30">
                    Resolve in Favor of Player 2
                  </Button>
                </div>
              )}

              {selectedDispute.admin_notes && (
                <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl p-6">
                  <h3 className="font-bold mb-2 text-gray-900">Admin Notes</h3>
                  <p className="text-gray-700">{selectedDispute.admin_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

