'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OverviewTab } from '@/components/admin/tabs/overview-tab'
import { TournamentsManageTab } from '@/components/admin/tabs/tournaments-manage-tab'
import { CreateTournamentTab } from '@/components/admin/tabs/create-tournament-tab'
import { DisputesManageTab } from '@/components/admin/tabs/disputes-manage-tab'
import { LayoutDashboard, Trophy, Plus, AlertCircle } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen pb-24">
      <Tabs defaultValue="overview" className="w-full">
        {/* Tab Content */}
        <TabsContent value="overview" className="m-0">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="tournaments" className="m-0">
          <TournamentsManageTab />
        </TabsContent>

        <TabsContent value="create" className="m-0">
          <CreateTournamentTab />
        </TabsContent>

        <TabsContent value="disputes" className="m-0">
          <DisputesManageTab />
        </TabsContent>

        {/* Bottom Navigation */}
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="container mx-auto max-w-4xl">
            <TabsList className="w-full bg-white border border-gray-200 shadow-2xl rounded-2xl p-2 grid grid-cols-4">
              <TabsTrigger 
                value="overview" 
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all py-3"
              >
                <LayoutDashboard className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tournaments"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all py-3"
              >
                <Trophy className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Tournaments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="create"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all py-3"
              >
                <Plus className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Create</span>
              </TabsTrigger>
              <TabsTrigger 
                value="disputes"
                className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all py-3"
              >
                <AlertCircle className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Disputes</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

