import { getCurrentUser } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TournamentDetail } from '@/components/tournaments/tournament-detail'
import { TournamentHeader } from '@/components/tournaments/tournament-header'
import { RegisterButton } from '@/components/tournaments/register-button'
import { TournamentBracket } from '@/components/tournaments/tournament-bracket'
import { TournamentChat } from '@/components/tournaments/tournament-chat'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

export default async function TournamentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const supabase = await createClient()
  const { id } = await params

  // Fetch tournament data
  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !tournament) {
    redirect('/dashboard')
  }

  // Check if user is registered
  const { data: registration } = await supabase
    .from('registrations')
    .select('*')
    .eq('tournament_id', id)
    .eq('user_id', user.id)
    .single()

  // Fetch participants
  const { data: participants } = await supabase
    .from('registrations')
    .select('*, profiles(*)')
    .eq('tournament_id', id)
    .eq('status', 'confirmed')

  // Fetch matches
  const { data: matches } = await supabase
    .from('matches')
    .select('*, player1:player1_id(full_name), player2:player2_id(full_name)')
    .eq('tournament_id', id)
    .order('round', { ascending: true })

  // Find user's active match
  const userMatch = matches?.find(
    m => 
      (m.player1_id === user.id || m.player2_id === user.id) && 
      m.status === 'ongoing'
  )

  const isRegistered = !!registration
  const participantCount = participants?.length || 0

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <TournamentHeader 
        tournament={tournament} 
        isRegistered={isRegistered}
        participantCount={participantCount}
      />

      {!isRegistered && tournament.status === 'registration' && (
        <div className="mt-6">
          <RegisterButton tournamentId={tournament.id} />
        </div>
      )}

      {userMatch && (
        <Card className="mt-6 border-2 border-blue-600">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-2 text-gray-900">Your Active Match</h3>
            <p className="text-gray-600 mb-4">
              You are currently matched against{' '}
              {userMatch.player1_id === user.id 
                ? userMatch.player2?.full_name 
                : userMatch.player1?.full_name}
            </p>
            <a href={`/dashboard/matches/${userMatch.id}/submit`}>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all">
                Submit Match Result
              </button>
            </a>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="bracket" className="w-full mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bracket">Bracket</TabsTrigger>
          <TabsTrigger value="participants">Players</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="bracket" className="mt-6">
          {matches && matches.length > 0 ? (
            <TournamentBracket 
              matches={matches} 
              format={tournament.format}
              currentUserId={user.id}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-600">
                <p>Bracket will be generated when tournament starts</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="participants" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">
                Registered Players ({participantCount}/{tournament.max_slots})
              </h3>
              <div className="grid gap-3">
                {participants && participants.length > 0 ? (
                  participants.map((participant: any) => (
                    <div 
                      key={participant.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                          {participant.profiles?.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{participant.profiles?.full_name}</span>
                      </div>
                      {participant.user_id === user.id && (
                        <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">You</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 py-4">No participants yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          {isRegistered ? (
            <TournamentChat 
              tournamentId={tournament.id}
              currentUserId={user.id}
              currentUserName={user.full_name || 'User'}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-gray-600">
                <p>Register for the tournament to access chat</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

