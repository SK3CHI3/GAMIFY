'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { resolveDispute } from '@/app/actions/matches'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'

interface DisputeReviewFormProps {
  dispute: any
}

export function DisputeReviewForm({ dispute }: DisputeReviewFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null)
  const [adminNotes, setAdminNotes] = useState('')

  const match = dispute.matches

  async function handleResolve() {
    if (!selectedWinner) {
      toast.error('Please select a winner')
      return
    }

    if (!adminNotes.trim()) {
      toast.error('Please add resolution notes')
      return
    }

    setLoading(true)

    const result = await resolveDispute(dispute.id, selectedWinner, adminNotes)

    if (result.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success('Dispute resolved successfully')
      router.push('/admin/disputes')
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      {/* Dispute Info */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Dispute Details</h3>
          <Badge variant="destructive">
            {dispute.status}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            <strong>Tournament:</strong> {match.tournaments.name}
          </p>
          <p className="text-gray-600">
            <strong>Round:</strong> {match.round} • Match {match.match_number}
          </p>
          <p className="text-gray-600">
            <strong>Created:</strong> {new Date(dispute.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Player Submissions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Player 1 */}
        <div 
          className={`
            glass-card p-6 cursor-pointer transition-all
            ${selectedWinner === match.player1_id 
              ? 'border-4 border-[#00FF88] shadow-glow-green' 
              : 'hover:border-2 hover:border-gray-300'}
          `}
          onClick={() => setSelectedWinner(match.player1_id)}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{match.player1?.full_name}</h3>
              <p className="text-sm text-gray-600">{match.player1?.email}</p>
            </div>
            {selectedWinner === match.player1_id && (
              <div className="w-8 h-8 rounded-full bg-[#00FF88] flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600">Claimed Score</Label>
              <p className="text-4xl font-bold text-[#00FF88]">{match.player1_score}</p>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Screenshot</Label>
              {match.player1_screenshot ? (
                <img 
                  src={match.player1_screenshot}
                  alt="Player 1 screenshot"
                  className="w-full rounded-lg border-2 border-gray-200 mt-2 cursor-pointer hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(match.player1_screenshot, '_blank')
                  }}
                />
              ) : (
                <p className="text-gray-400 italic">No screenshot submitted</p>
              )}
            </div>

            {match.player1_submitted && (
              <Badge variant="outline" className="border-[#00FF88]">
                Submitted
              </Badge>
            )}
          </div>
        </div>

        {/* Player 2 */}
        <div 
          className={`
            glass-card p-6 cursor-pointer transition-all
            ${selectedWinner === match.player2_id 
              ? 'border-4 border-[#00FF88] shadow-glow-green' 
              : 'hover:border-2 hover:border-gray-300'}
          `}
          onClick={() => setSelectedWinner(match.player2_id)}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{match.player2?.full_name}</h3>
              <p className="text-sm text-gray-600">{match.player2?.email}</p>
            </div>
            {selectedWinner === match.player2_id && (
              <div className="w-8 h-8 rounded-full bg-[#00FF88] flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600">Claimed Score</Label>
              <p className="text-4xl font-bold text-[#00FF88]">{match.player2_score}</p>
            </div>

            <div>
              <Label className="text-sm text-gray-600">Screenshot</Label>
              {match.player2_screenshot ? (
                <img 
                  src={match.player2_screenshot}
                  alt="Player 2 screenshot"
                  className="w-full rounded-lg border-2 border-gray-200 mt-2 cursor-pointer hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(match.player2_screenshot, '_blank')
                  }}
                />
              ) : (
                <p className="text-gray-400 italic">No screenshot submitted</p>
              )}
            </div>

            {match.player2_submitted && (
              <Badge variant="outline" className="border-[#00FF88]">
                Submitted
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Admin Notes */}
      <div className="glass-card p-6">
        <Label htmlFor="adminNotes">Resolution Notes *</Label>
        <Textarea
          id="adminNotes"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Explain your decision and reasoning..."
          rows={4}
          className="mt-2"
          disabled={loading}
        />
        <p className="text-sm text-gray-600 mt-2">
          This will be saved in the dispute record for future reference
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleResolve}
          disabled={loading || !selectedWinner || !adminNotes.trim()}
          className="flex-1 gradient-primary text-white font-bold shadow-glow-green"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resolving...
            </>
          ) : (
            'Resolve Dispute'
          )}
        </Button>
      </div>
    </div>
  )
}

