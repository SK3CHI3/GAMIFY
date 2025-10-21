'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Trophy, 
  Plus, 
  Target,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Settings,
  Bell,
  Activity
} from 'lucide-react'

// Import all the admin components
import { OverviewTab } from '@/components/admin/tabs/overview-tab'
import { AnalyticsDashboard } from '@/components/admin/analytics/analytics-dashboard'
import { PlayerManagement } from '@/components/admin/players/player-management'
import { TournamentsManageTab } from '@/components/admin/tabs/tournaments-manage-tab'
import { CreateTournamentTab } from '@/components/admin/tabs/create-tournament-tab'
import { LiveBracket } from '@/components/admin/tournaments/live-bracket'
import { FinancialDashboard } from '@/components/admin/financial/financial-dashboard'
import { AdvancedDisputeResolution } from '@/components/admin/disputes/advanced-dispute-resolution'
import { AdminCommunication } from '@/components/admin/communication/admin-communication'
import { SystemAdministration } from '@/components/admin/system/system-administration'

const navigationItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    description: 'Dashboard overview and key metrics'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Detailed analytics and reports'
  },
  {
    id: 'players',
    label: 'Players',
    icon: Users,
    description: 'Player management and statistics'
  },
  {
    id: 'tournaments',
    label: 'Tournaments',
    icon: Trophy,
    description: 'Tournament management'
  },
  {
    id: 'create',
    label: 'Create Tournament',
    icon: Plus,
    description: 'Create new tournaments'
  },
  {
    id: 'brackets',
    label: 'Live Brackets',
    icon: Target,
    description: 'Live tournament brackets'
  },
  {
    id: 'financial',
    label: 'Financial',
    icon: DollarSign,
    description: 'Revenue and financial tracking'
  },
  {
    id: 'disputes',
    label: 'Disputes',
    icon: AlertCircle,
    description: 'Dispute resolution system'
  },
  {
    id: 'communication',
    label: 'Messages',
    icon: MessageSquare,
    description: 'Player communication'
  },
  {
    id: 'system',
    label: 'System',
    icon: Settings,
    description: 'System administration'
  }
]

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview')

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewTab />
      case 'analytics':
        return <AnalyticsDashboard />
      case 'players':
        return <PlayerManagement />
      case 'tournaments':
        return <TournamentsManageTab />
      case 'create':
        return <CreateTournamentTab />
      case 'brackets':
        return <LiveBracket tournamentId="sample-tournament-id" />
      case 'financial':
        return <FinancialDashboard />
      case 'disputes':
        return <AdvancedDisputeResolution />
      case 'communication':
        return <AdminCommunication />
      case 'system':
        return <SystemAdministration />
      default:
        return <OverviewTab />
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100/40 via-white to-yellow-100/40">
      {/* Sidebar */}
      <div className="w-64 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden" style={{ backgroundColor: '#FFFF00' }}>
              <Image
                src="/images/GOALDEN LOGO/GOALDEN_logo.png"
                alt="GOALDEN Logo"
                width={120}
                height={120}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GOALDEN</h1>
              <p className="text-sm text-gray-600">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start h-auto p-4 ${
                    isActive 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                  </div>
                </Button>
              )
            })}
          </nav>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {navigationItems.find(item => item.id === activeSection)?.label}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {navigationItems.find(item => item.id === activeSection)?.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
                    <Activity className="w-4 h-4 mr-1" />
                    Live
                  </Badge>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                </div>
              </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  )
}