import { getCurrentUser } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DisputeReviewForm } from '@/components/admin/dispute-review-form'

export default async function DisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    redirect('/')
  }

  const supabase = await createClient()
  const { id } = await params

  const { data: dispute, error } = await supabase
    .from('disputes')
    .select(`
      *,
      matches (
        *,
        player1:player1_id(full_name, email),
        player2:player2_id(full_name, email),
        tournaments(name)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !dispute) {
    redirect('/admin/disputes')
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold gradient-text">Dispute Resolution</h1>
        <p className="text-gray-600 mt-2">
          {dispute.matches.tournaments.name} • Match #{dispute.matches.match_number}
        </p>
      </div>

      <DisputeReviewForm dispute={dispute} />
    </div>
  )
}

