'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/app/actions/auth'
import { Loader2, Check, X, Eye, EyeOff, Mail, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null)
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength(null)
      return
    }

    // Basic password strength check
    let strength: 'weak' | 'medium' | 'strong' = 'weak'
    let score = 0

    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score >= 4) strength = 'strong'
    else if (score >= 2) strength = 'medium'
    
    setPasswordStrength(strength)
  }, [password])

  useEffect(() => {
    if (confirmPassword.length > 0) {
      setPasswordsMatch(password === confirmPassword)
    }
  }, [password, confirmPassword])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    setUserEmail(email)
    
    const result = await signUp(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // Show success message instead of redirecting
      setSuccess(true)
      setLoading(false)
    }
  }

  const getStrengthColor = () => {
    if (!passwordStrength) return 'bg-gray-200'
    if (passwordStrength === 'weak') return 'bg-red-500'
    if (passwordStrength === 'medium') return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getStrengthWidth = () => {
    if (!passwordStrength) return 'w-0'
    if (passwordStrength === 'weak') return 'w-1/3'
    if (passwordStrength === 'medium') return 'w-2/3'
    return 'w-full'
  }

  // Show success message if signup was successful
  if (success) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              Check Your Email! 📧
            </h2>
            <p className="text-gray-600 text-lg">
              We've sent a confirmation link to
            </p>
            <p className="text-blue-600 font-semibold text-lg">
              {userEmail}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3 text-left">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm text-gray-700 font-medium">
                  <strong>Next Steps:</strong>
                </p>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Open your email inbox</li>
                  <li>Look for an email from GOALDEN</li>
                  <li>Click the confirmation link</li>
                  <li>Start competing and winning! 🏆</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Didn't receive the email?</strong> Check your spam folder or{' '}
              <button 
                onClick={() => setSuccess(false)}
                className="text-blue-600 hover:text-blue-700 font-semibold underline"
              >
                try signing up again
              </button>
            </p>
          </div>

          <Link href="/sign-in">
            <Button 
              variant="outline" 
              className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50"
            >
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          Join GOALDEN
        </h2>
        <p className="text-gray-600">Create your account to start competing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-gray-700">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            placeholder="John Doe"
            required
            disabled={loading}
            className="h-12"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            disabled={loading}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+254712345678"
            required
            disabled={loading}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              minLength={8}
              disabled={loading}
              className="h-12 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStrengthColor()} ${getStrengthWidth()} transition-all duration-300`}
                  />
                </div>
                <span className={`text-xs font-semibold ${
                  passwordStrength === 'weak' ? 'text-red-500' : 
                  passwordStrength === 'medium' ? 'text-yellow-500' : 
                  'text-blue-500'
                }`}>
                  {passwordStrength === 'weak' ? 'Weak' : 
                   passwordStrength === 'medium' ? 'Medium' : 
                   'Strong'}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm_password" className="text-gray-700">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              disabled={loading}
              className={`h-12 pr-20 ${!passwordsMatch && confirmPassword.length > 0 ? 'border-red-500' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {confirmPassword.length > 0 && (
                <div>
                  {passwordsMatch ? (
                    <Check className="w-5 h-5 text-blue-500" />
                  ) : (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          {!passwordsMatch && confirmPassword.length > 0 && (
            <p className="text-sm text-red-500">Passwords do not match</p>
          )}
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
          disabled={loading || !passwordsMatch}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}

