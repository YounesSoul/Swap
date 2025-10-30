"use client";

import { 
  WelcomeCard, 
  NextSessionCard, 
  BalanceCard, 
  QuickActionsCard,
  PendingRequestsCard,
  LatestSessionsCard,
  ScheduleCalendarCard
} from "@/components/dashboard/BentoCards";
import { StatsOverview } from "@/components/dashboard/StatsOverview";

export default function Dashboard(){
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-6">
          <WelcomeCard />
        </div>
        
        {/* Stats Row - 4 cards */}
        <div className="mb-6">
          <StatsOverview />
        </div>
        
        {/* Main Content Grid - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Upcoming Sessions */}
          <NextSessionCard />
          
          {/* Right Column - Calendar */}
          <ScheduleCalendarCard />
        </div>
        
        {/* Bottom Row - 2 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PendingRequestsCard />
          <LatestSessionsCard />
        </div>
      </div>
    </div>
  );
}
