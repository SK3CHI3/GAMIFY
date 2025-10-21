'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Trophy, Users, AlertCircle, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/admin/tournaments',
      label: 'Tournaments',
      icon: Trophy,
    },
    {
      href: '/admin/tournaments/create',
      label: 'Create Tournament',
      icon: Plus,
    },
    {
      href: '/admin/disputes',
      label: 'Disputes',
      icon: AlertCircle,
    },
    {
      href: '/admin/players',
      label: 'Players',
      icon: Users,
    },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/20 p-6 z-50">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden" style={{ backgroundColor: '#FFFF00' }}>
            <Image
              src="/images/GOALDEN LOGO/GOALDEN_logo.png"
              alt="GOALDEN Logo"
              width={120}
              height={120}
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold gradient-text">GOALDEN</h2>
        </div>
        <p className="text-sm text-gray-600">Admin Panel</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all animate-smooth',
                isActive
                  ? 'gradient-primary text-white shadow-glow-green'
                  : 'text-gray-700 hover:bg-white/50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

