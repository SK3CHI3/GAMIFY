'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPassword } from '@/app/actions/auth'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const result = await resetPassword(email)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!success ? (
        <>
          <div className="space-y-2">
            <p className="text-gray-600 text-center">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-12"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-white font-semibold hover:shadow-lg transition-all"
              style={{ backgroundColor: '#FFFF00', color: '#000000' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/sign-in"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        </>
      ) : (
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">Check Your Email</h3>
            <p className="text-gray-600">
              We&apos;ve sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Click the link in the email to reset your password. If you don&apos;t see it, check your spam folder.
            </p>
          </div>
          <Link href="/sign-in">
            <Button
              className="w-full h-12 text-white font-semibold hover:shadow-lg transition-all"
              style={{ backgroundColor: '#FFFF00', color: '#000000' }}
            >
              Back to Sign In
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

