'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HomeTab } from '@/components/dashboard/tabs/home-tab'
import { TournamentsTab } from '@/components/dashboard/tabs/tournaments-tab'
import { ProfileTab } from '@/components/dashboard/tabs/profile-tab'
import { Home, Trophy, User } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen pb-24">
      <Tabs defaultValue="home" className="w-full">
        {/* Tab Content */}
        <TabsContent value="home" className="m-0">
          <HomeTab />
        </TabsContent>

        <TabsContent value="tournaments" className="m-0">
          <TournamentsTab />
        </TabsContent>

        <TabsContent value="profile" className="m-0">
          <ProfileTab />
        </TabsContent>

        {/* Bottom Navigation */}
        <div className="fixed bottom-4 left-4 right-4 z-50">
          <div className="container mx-auto max-w-md">
            <TabsList className="w-full bg-white border border-gray-200 shadow-2xl rounded-2xl p-2">
              <TabsTrigger 
                value="home" 
                className="flex-1 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all py-3"
              >
                <Home className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Home</span>
              </TabsTrigger>
              <TabsTrigger 
                value="tournaments"
                className="flex-1 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all py-3"
              >
                <Trophy className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Tournaments</span>
              </TabsTrigger>
              <TabsTrigger 
                value="profile"
                className="flex-1 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all py-3"
              >
                <User className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Profile</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </Tabs>
    </div>
  )
}

