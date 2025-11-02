import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-yellow-50 p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/80 border border-blue-200/50 rounded-2xl shadow-2xl p-8 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-yellow-500 flex items-center justify-center shadow-lg">
              <Image
                src="/images/GOALDEN LOGO/GOALDEN_logo.png"
                alt="GOALDEN Logo"
                width={60}
                height={60}
                className="w-auto h-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          </div>
          
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}

