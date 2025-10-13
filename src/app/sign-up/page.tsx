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
      <div className="relative hidden lg:flex items-center justify-center flex-1 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-12">
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
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-bold">MATCHFY</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl font-bold leading-tight">Start Your Journey!</h1>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Join thousands of players competing in automated eFootball tournaments.
            </p>
          </motion.div>

          <div className="space-y-5 pt-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Award className="w-6 h-6 text-white" />
              </div>
              <span className="text-emerald-100 text-lg">Win real cash prizes</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-emerald-100 text-lg">Instant verification</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-emerald-100 text-lg">Fair play guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="flex items-center justify-center flex-1 p-8 lg:p-12 bg-white relative">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                MATCHFY
              </span>
            </Link>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <SignUpForm onToggle={() => {}} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

