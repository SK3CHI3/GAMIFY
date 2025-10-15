'use client'

import { Trophy, Zap, Shield, Users, ArrowRight, CheckCircle, Gamepad2, Award, TrendingUp, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
      {/* Navbar - Glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FFFF00' }}>
                <Gamepad2 className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-2xl font-bold text-white">
                MATCHFY
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                href="/sign-in"
                className="text-white hover:opacity-80 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up"
                className="px-6 py-2.5 font-semibold rounded-xl transition-all hover:scale-105"
                style={{ backgroundColor: '#FFFF00', color: '#000000' }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Full Screen Background Image - Covers entire viewport */}
        <div className="absolute top-0 left-0 w-full h-full min-h-screen">
          <img
            src="/images/hero/hero.jpg"
            alt="Gaming Background"
            className="w-full h-full min-h-screen object-cover object-center"
          />
        </div>

        {/* Content Container - Mobile Optimized */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-24 pb-12 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6 md:space-y-8"
          >
            {/* Main Title - Mobile Optimized */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight">
              <span className="block text-white drop-shadow-2xl mb-1">Dominate in</span>
              <span className="block drop-shadow-2xl mb-1" style={{ color: '#FFFF00' }}>
                eFootball
              </span>
              <span className="block text-white drop-shadow-2xl">Tournaments</span>
            </h1>

            {/* Subtitle - Mobile Optimized */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white drop-shadow-lg max-w-3xl mx-auto font-medium px-2 sm:px-4">
              Join the ultimate competitive platform. Automated brackets, instant verification, and real cash prizes await.
            </p>

            {/* Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-3 sm:pt-4 max-w-md sm:max-w-none mx-auto">
              <Link
                href="/sign-up"
                className="px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base md:text-lg font-bold rounded-xl shadow-xl hover:scale-105 transition-all w-full sm:w-auto"
                style={{ backgroundColor: '#FFFF00', color: '#000000' }}
              >
                <span className="flex items-center justify-center gap-2">
                  Start Competing Now
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              </Link>
              <button className="px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base md:text-lg bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold rounded-xl hover:bg-white/20 transition-all w-full sm:w-auto">
                <span className="flex items-center justify-center gap-2">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                  Watch Demo
                </span>
              </button>
            </div>

            {/* Stats - Mobile Optimized */}
            <div className="flex justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 pt-4 sm:pt-6 md:pt-8 flex-wrap">
              <div className="text-center min-w-[80px] sm:min-w-0">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black drop-shadow-lg" style={{ color: '#FFFF00' }}>1000+</div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white drop-shadow-md mt-0.5 sm:mt-1">Active Players</div>
              </div>
              <div className="text-center min-w-[80px] sm:min-w-0">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black drop-shadow-lg" style={{ color: '#FFFF00' }}>50+</div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white drop-shadow-md mt-0.5 sm:mt-1">Live Tournaments</div>
              </div>
              <div className="text-center min-w-[80px] sm:min-w-0">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black drop-shadow-lg" style={{ color: '#FFFF00' }}>KES 500K</div>
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white drop-shadow-md mt-0.5 sm:mt-1">In Prizes</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-blue-900/50 to-blue-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">Why Choose MATCHFY?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The most advanced eFootball tournament platform with automated bracket management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Trophy,
                title: 'Win Real Prizes',
                description: 'Compete for cash prizes in every tournament'
              },
              {
                icon: Zap,
                title: 'Instant Matching',
                description: 'Automated opponent pairing and bracket generation'
              },
              {
                icon: Shield,
                title: 'Fair Verification',
                description: 'Screenshot-based result verification system'
              },
              {
                icon: Users,
                title: 'Active Community',
                description: 'Real-time chat and player interactions'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 hover:bg-white/15 transition-all hover:scale-105"
              >
                <div className="w-14 h-14 rounded-2xl p-3 mb-6 group-hover:scale-110 transition-transform" style={{ backgroundColor: '#FFFF00' }}>
                  <feature.icon className="w-full h-full text-gray-900" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-b from-blue-950/50 to-blue-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Register & Pay',
                description: 'Choose your tournament, pay the entry fee, and get added to the bracket automatically',
                icon: Gamepad2
              },
              {
                step: '02',
                title: 'Play & Submit',
                description: 'Compete in your matches and submit results with a screenshot for verification',
                icon: Award
              },
              {
                step: '03',
                title: 'Win Prizes',
                description: 'Advance through rounds, win the tournament, and claim your cash prize',
                icon: TrendingUp
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:bg-white/15">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-5xl font-black text-white">{item.step}</span>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFF00' }}>
                      <item.icon className="w-6 h-6 text-gray-900" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FFFF00' }}>
                      <ArrowRight className="w-5 h-5 text-gray-900" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot/Preview Section */}
      <section className="py-24 bg-gradient-to-b from-blue-900/50 to-blue-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Experience the Platform</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              See how MATCHFY revolutionizes eFootball tournaments
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20 border border-gray-200">
          <Image
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80"
                alt="Platform Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Real-time Tournament Brackets</h3>
                <p className="text-gray-300">Track your progress and upcoming matches in real-time</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-b from-blue-950/50 to-blue-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Built for <span style={{ color: '#FFFF00' }}>Serious</span> Players
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                MATCHFY provides a professional tournament experience with automated systems and fair play guarantees.
              </p>

              <div className="space-y-4">
                {[
                  'Automated bracket generation and match pairing',
                  'Real-time tournament updates and notifications',
                  'Secure payment processing with M-PESA',
                  'Admin dispute resolution for fair outcomes',
                  'Player stats and performance tracking',
                  'Mobile-optimized PWA experience'
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#FFFF00' }} />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative h-full min-h-[500px]"
            >
              <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/20 border border-gray-200">
          <Image
                  src="https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&q=80"
                  alt="Gaming Setup"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-800/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-blue-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Start Winning?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join thousands of players competing in MATCHFY tournaments. Sign up now and dominate the competition.
            </p>
            <Link
              href="/sign-up"
              className="group inline-flex px-10 py-5 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
              style={{ backgroundColor: '#FFFF00', color: '#000000' }}
            >
              <span className="flex items-center gap-3">
                Get Started Free
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950/80 backdrop-blur-md border-t border-white/10 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#FFFF00' }}>
                MATCHFY
              </h3>
              <p className="text-gray-300">
                The ultimate eFootball tournament platform for competitive players.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:opacity-80 transition-colors">Tournaments</a></li>
                <li><a href="#" className="hover:opacity-80 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:opacity-80 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:opacity-80 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:opacity-80 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:opacity-80 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:opacity-80 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:opacity-80 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2025 MATCHFY. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
