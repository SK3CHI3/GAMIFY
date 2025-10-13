import { getCurrentUser } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MatchSubmissionForm } from '@/components/matches/match-submission-form'

export default async function MatchSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/')
  }

  const supabase = await createClient()
  const { id } = await params

  // Fetch match data
  const { data: match, error } = await supabase
    .from('matches')
    .select(`
      *,
      player1:player1_id(full_name),
      player2:player2_id(full_name),
      tournament:tournaments(name)
    `)
    .eq('id', id)
    .single()

  if (error || !match) {
    redirect('/dashboard')
  }

  // Verify user is part of this match
  if (match.player1_id !== user.id && match.player2_id !== user.id) {
    redirect('/dashboard')
  }

  const isPlayer1 = match.player1_id === user.id
  const opponent = isPlayer1 ? match.player2 : match.player1
  const userSubmitted = isPlayer1 ? match.player1_submitted : match.player2_submitted
  const userScore = isPlayer1 ? match.player1_score : match.player2_score
  const userScreenshot = isPlayer1 ? match.player1_screenshot : match.player2_screenshot

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="glass-card p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold gradient-text">Submit Match Result</h1>
          <p className="text-gray-600">
            {match.tournament?.name} • vs {opponent?.full_name}
          </p>
        </div>

        {userSubmitted ? (
          <div className="bg-[#00FF88]/10 border border-[#00FF88] rounded-lg p-6 space-y-4">
            <h3 className="font-bold text-lg">Your Submission</h3>
            <div className="space-y-2">
              <p className="text-gray-600">Score: <span className="font-bold text-2xl">{userScore}</span></p>
              {userScreenshot && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Screenshot:</p>
                  <img 
                    src={userScreenshot} 
                    alt="Match result" 
                    className="rounded-lg max-w-full h-auto border-2 border-[#00FF88]"
                  />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Waiting for opponent to submit their result...
            </p>
          </div>
        ) : (
          <MatchSubmissionForm 
            matchId={match.id}
            isPlayer1={isPlayer1}
            opponentName={opponent?.full_name || 'Opponent'}
          />
        )}
      </div>
    </div>
  )
}

