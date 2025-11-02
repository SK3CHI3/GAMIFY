'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { registerForTournament } from '@/app/actions/tournaments'
import { toast } from 'sonner'
import { Loader2, Trophy, CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface RegisterButtonProps {
  tournamentId: string
  entryFee: number
}

export function RegisterButton({ tournamentId, entryFee }: RegisterButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [userData, setUserData] = useState({ email: '', phone: '', firstName: '', lastName: '' })

  useEffect(() => {
    // Load user data
    async function loadUserData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email, phone')
          .eq('id', user.id)
          .single()

        if (profile) {
          const nameParts = profile.full_name?.split(' ') || ['', '']
          setUserData({
            email: user.email || '',
            phone: profile.phone || '',
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || ''
          })
        }
      }
    }

    loadUserData()
  }, [])

  useEffect(() => {
    // Initialize IntaSend payment button
    if (showPayment && typeof window !== 'undefined') {
      // Load the IntaSend script dynamically
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/[email protected]/build/intasend-inline.js'
      script.async = true
      script.onload = () => {
        // Initialize IntaSend after script loads
        if (window.IntaSend) {
          new window.IntaSend({
            publicAPIKey: process.env.NEXT_PUBLIC_INTASEND_PUBLIC_KEY || '',
            live: process.env.NEXT_PUBLIC_INTASEND_LIVE === 'true'
          })
          .on('COMPLETE', async (results: any) => {
            console.log('Payment successful:', results)
            // Register for tournament after successful payment
            const result = await registerForTournament(tournamentId)
            if (result.error) {
              toast.error(result.error)
            } else {
              if (result.status === 'waitlist') {
                toast.success('Payment successful! Added to waitlist.')
              } else {
                toast.success('Payment successful! Successfully registered for tournament!')
              }
              router.refresh()
            }
            setShowPayment(false)
          })
          .on('FAILED', (results: any) => {
            console.error('Payment failed:', results)
            toast.error('Payment failed. Please try again.')
            setShowPayment(false)
          })
          .on('IN-PROGRESS', () => {
            console.log('Payment in progress...')
          })
        }
      }
      document.head.appendChild(script)

      return () => {
        // Cleanup: Remove script on unmount
        const existingScript = document.querySelector('script[src*="intasend-inline.js"]')
        if (existingScript) {
          existingScript.remove()
        }
      }
    }
  }, [showPayment, tournamentId, router])

  async function handleRegister() {
    setShowPayment(true)
  }

  return (
    <div className="space-y-4">
      {!showPayment ? (
        <Button
          onClick={handleRegister}
          disabled={loading}
          className="w-full gradient-primary text-white font-bold text-lg py-6 shadow-glow-green"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-5 w-5" />
              Pay & Register - KES {entryFee}
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-4">
          <Button
            onClick={() => setShowPayment(false)}
            variant="outline"
            className="w-full"
          >
            Cancel Payment
          </Button>
          
          {/* IntaSend Payment Button */}
          <div className="flex justify-center">
            <button 
              className="intaSendPayButton inline-flex items-center justify-center gap-2 w-full gradient-primary text-white font-bold text-lg py-6 shadow-glow-green rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              data-amount={entryFee}
              data-currency="KES"
              data-email={userData.email}
              data-phone_number={userData.phone}
              data-first_name={userData.firstName}
              data-last_name={userData.lastName}
              data-api_ref={`tournament_${tournamentId}`}
              data-comment={`Tournament registration for ${tournamentId}`}
              data-method="M-PESA"
              data-redirect_url={`${window.location.origin}/dashboard/tournaments/${tournamentId}`}
            >
              <Trophy className="w-5 h-5" />
              Complete Payment - KES {entryFee}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
