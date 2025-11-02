'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ResetPasswordContent } from '@/components/auth/reset-password-content'

function ResetPasswordPageContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const type = searchParams.get('type')

  return <ResetPasswordContent token={token} type={type} />
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/80 border border-blue-200/50 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  )
}

