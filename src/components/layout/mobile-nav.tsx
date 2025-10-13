'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Trophy, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/dashboard',
      label: 'Home',
      icon: Home,
    },
    {
      href: '/dashboard/tournaments',
      label: 'Tournaments',
      icon: Trophy,
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 pb-safe">
      <div className="backdrop-blur-xl bg-white/80 border border-white/40 rounded-2xl shadow-xl shadow-emerald-500/10">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-6 py-3 rounded-xl transition-all',
                  isActive
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-semibold">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

