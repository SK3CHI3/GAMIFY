'use client'

import { Trophy, Zap, Shield, Users, ArrowRight, CheckCircle, Gamepad2, Award, TrendingUp, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                MATCHFY
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                href="/sign-in"
                className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
        <Image
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&q=80"
            alt="Gaming Background"
            fill
            className="object-cover opacity-70"
          priority
        />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/80 via-teal-50/70 to-transparent" />
        </div>
        
        {/* Curved Shape Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <svg className="absolute right-0 h-full w-1/2" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 Q50,50 0,100 L100,100 L100,0 Z" fill="url(#gradient)" opacity="0.5" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#14b8a6', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-0 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-semibold">
                  <Zap className="w-4 h-4" />
                  AI-Powered Tournament Platform
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1]">
                <span className="text-gray-900">Dominate in</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  eFootball
                </span>
                <br />
                <span className="text-gray-900">Tournaments</span>
              </h1>

              <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                Join the ultimate competitive platform. Automated brackets, instant verification, and real cash prizes await.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/sign-up"
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    Start Competing Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <button className="group px-8 py-4 border-2 border-emerald-600 text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all">
                  <span className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Watch Demo
                  </span>
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">1000+</div>
                  <div className="text-sm text-gray-600">Active Players</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">50+</div>
                  <div className="text-sm text-gray-600">Live Tournaments</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">KES 500K</div>
                  <div className="text-sm text-gray-600">In Prizes</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Why Choose MATCHFY?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most advanced eFootball tournament platform with automated bracket management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Trophy,
                title: 'Win Real Prizes',
                description: 'Compete for cash prizes in every tournament',
                gradient: 'from-emerald-500 to-teal-500',
                image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80'
              },
              {
                icon: Zap,
                title: 'Instant Matching',
                description: 'Automated opponent pairing and bracket generation',
                gradient: 'from-teal-500 to-cyan-500',
                image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80'
              },
              {
                icon: Shield,
                title: 'Fair Verification',
                description: 'Screenshot-based result verification system',
                gradient: 'from-emerald-600 to-emerald-500',
                image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400&q=80'
              },
              {
                icon: Users,
                title: 'Active Community',
                description: 'Real-time chat and player interactions',
                gradient: 'from-teal-600 to-emerald-600',
                image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="absolute inset-0">
            <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover opacity-10 group-hover:opacity-15 transition-opacity"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-10`} />
                </div>
                <div className="relative glass-card p-8 h-full hover:shadow-xl transition-all border border-gray-100">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-emerald-50/30">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{item.step}</span>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot/Preview Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Experience the Platform</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">Real-time Tournament Brackets</h3>
                <p className="text-emerald-100">Track your progress and upcoming matches in real-time</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 to-teal-50/50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Built for <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Serious</span> Players
              </h2>
              <p className="text-xl text-gray-600 mb-8">
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
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
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
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-teal-600/20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-teal-700">
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
            <p className="text-xl text-emerald-100 mb-10">
              Join thousands of players competing in MATCHFY tournaments. Sign up now and dominate the competition.
            </p>
            <Link
              href="/sign-up"
              className="group inline-flex px-10 py-5 bg-white text-emerald-600 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                MATCHFY
              </h3>
              <p className="text-gray-400">
                The ultimate eFootball tournament platform for competitive players.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Tournaments</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MATCHFY. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
