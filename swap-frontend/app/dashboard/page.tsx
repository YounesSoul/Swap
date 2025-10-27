"use client";

import { MagicBento } from "@/components/ui/magic-bento";
import { 
  WelcomeCard, 
  NextSessionCard, 
  BalanceCard, 
  QuickActionsCard
} from "@/components/dashboard/BentoCards";
import { DashboardStatsCarousel } from "@/components/dashboard/DashboardStatsCarousel";
import { EnhancedScheduleCard } from "@/components/dashboard/EnhancedScheduleCard";

export default function Dashboard(){
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <MagicBento className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Welcome Section - Full Width */}
        <div className="col-span-full">
          <WelcomeCard />
        </div>
        
        {/* Stats Overview - Full Width */}
        <div className="col-span-full">
          <DashboardStatsCarousel />
        </div>
        
        {/* Main Content Grid */}
        <div className="md:col-span-1 lg:col-span-1">
          <NextSessionCard />
        </div>
        
        <div className="md:col-span-1 lg:col-span-1">
          <BalanceCard />
        </div>
        
        <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
          <QuickActionsCard />
        </div>
        
        {/* Enhanced Schedule Section - Full Width */}
        <div className="col-span-full">
          <EnhancedScheduleCard />
        </div>
      </MagicBento>
    </div>
  );
}
