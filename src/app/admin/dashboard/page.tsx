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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Fixed */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
        <div className="p-6 border-b border-gray-200">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/GOALDEN LOGO/GOALDEN_logo.png"
              alt="GOALDEN Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">GOALDEN</h1>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            
            return (
              <button
                key={item.id}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {item.label}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>System Online</span>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto h-screen">
        {/* Top Header Bar - Sticky */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {navigationItems.find(item => item.id === activeSection)?.label}
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                {navigationItems.find(item => item.id === activeSection)?.description}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 px-3 py-1">
                <Activity className="w-3 h-3 mr-1.5" />
                Live
              </Badge>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  )
}