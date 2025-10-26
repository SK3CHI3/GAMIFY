'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Sorry, we couldn't confirm your email address. This could be because:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>The confirmation link has expired</li>
            <li>The link has already been used</li>
            <li>The link is invalid</li>
          </ul>
          <div className="flex flex-col gap-3 pt-4">
            <Link href="/sign-up">
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                Try Signing Up Again
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

