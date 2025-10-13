'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { registerForTournament } from '@/app/actions/tournaments'
import { toast } from 'sonner'
import { Loader2, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function RegisterButton({ tournamentId }: { tournamentId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    setLoading(true)

    try {
      const result = await registerForTournament(tournamentId)

      if (result.error) {
        toast.error(result.error)
      } else {
        if (result.status === 'waitlist') {
          toast.success('Added to waitlist! You will be notified if a spot opens up.')
        } else {
          toast.success('Successfully registered for tournament!')
        }
        router.refresh()
      }
    } catch {
      toast.error('Failed to register')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleRegister}
      disabled={loading}
      className="w-full gradient-primary text-white font-bold text-lg py-6 shadow-glow-green"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Registering...
        </>
      ) : (
        <>
          <Trophy className="mr-2 h-5 w-5" />
          Register for Tournament
        </>
      )}
    </Button>
  )
}

