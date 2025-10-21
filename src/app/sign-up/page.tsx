'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { SignUpForm } from '@/components/auth/sign-up-form'
import { Trophy, Award, Shield, Gamepad2 } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left Side - Branding & Image */}
      <div className="relative hidden lg:flex items-center justify-center flex-1 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-12">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80"
            alt="Gaming Background"
            fill
            className="object-cover opacity-20"
          />
        </div>
        
        <div className="relative z-10 max-w-md text-white space-y-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden" style={{ backgroundColor: '#FFFF00' }}>
      <Image
        src="/images/GOALDEN LOGO/GOALDEN_logo.png"
        alt="GOALDEN Logo"
        width={120}
        height={120}
        className="w-full h-full object-contain"
      />
            </div>
            <span className="text-3xl font-bold text-white">GOALDEN</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl font-bold leading-tight">Start Your Journey!</h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              Join thousands of players competing in automated eFootball tournaments.
            </p>
          </motion.div>

          <div className="space-y-5 pt-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FFFF00' }}>
                <Award className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-blue-100 text-lg">Win real cash prizes</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FFFF00' }}>
                <Shield className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-blue-100 text-lg">Instant verification</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FFFF00' }}>
                <Gamepad2 className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-blue-100 text-lg">Fair play guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex items-center justify-center flex-1 p-8 lg:p-12 bg-white relative">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FFFF00' }}>
                <Trophy className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                GOALDEN
              </span>
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SignUpForm />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

