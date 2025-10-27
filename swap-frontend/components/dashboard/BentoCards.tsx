"use client";

import { MagicCard } from "@/components/ui/magic-bento";
import { useSwap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  Wallet, 
  TrendingUp, 
  Users, 
  BookOpen,
  GraduationCap,
  Upload,
  History
} from "lucide-react";

export const NextSessionCard = () => {
  const sessions = useSwap(s => s.sessions);
  const me = useSwap(s => s.me);
  const next = sessions[0];
  
  const otherEmail = next
    ? (('teacher' in next && (next as any).teacher?.email && (next as any).teacher?.email !== me?.email)
        ? (next as any).teacher.email
        : (next as any).learner?.email)
    : null;

  return (
    <MagicCard className="p-6 h-full" enableStars={true} enableSpotlight={true} enableMagnetism={false} glowColor="147, 51, 234">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Next Session</h3>
        </div>
        
        {!next ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 flex-1">
            <Calendar className="mb-4 h-12 w-12 text-gray-300" />
            <p className="text-sm mb-4">No upcoming sessions</p>
            <Link href="/matches">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Schedule Session
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4 flex-1">
            <div>
              <div className="text-xl font-bold text-gray-900 mb-2">
                {(next as any).courseCode}
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock className="h-4 w-4" />
                <span>{(next as any).minutes} minutes</span>
              </div>
              <div className="text-sm text-gray-600">
                with {otherEmail === me?.email ? "yourself" : otherEmail}
              </div>
            </div>
            
            {otherEmail && (
              <Link href={`/chat?with=${encodeURIComponent(otherEmail)}`}>
                <Button className="w-full gap-2 mt-4" variant="outline">
                  <MessageSquare className="h-4 w-4" />
                  Send Message
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </MagicCard>
  );
};

export const BalanceCard = () => {
  const tokenBalance = useSwap(s => s.tokenBalance);

  return (
    <MagicCard className="p-6 h-full" enableStars={true} enableSpotlight={true} enableMagnetism={false} glowColor="16, 185, 129">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Wallet className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Token Balance</h3>
        </div>
        
        <div className="flex items-center justify-between flex-1">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {tokenBalance}
              <span className="text-lg font-normal ml-2 text-gray-600">
                token{tokenBalance === 1 ? "" : "s"}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Teach 60 minutes → Earn 1 token
            </div>
          </div>
          <div className="p-4 bg-emerald-50 rounded-full">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
      </div>
    </MagicCard>
  );
};

export const QuickActionsCard = () => {
  return (
    <MagicCard className="p-6 h-full" enableStars={true} enableSpotlight={true} enableMagnetism={false} glowColor="236, 72, 153">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Users className="h-5 w-5 text-pink-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3 flex-1">
          <Link href="/matches">
            <Button variant="outline" className="h-full p-4 flex flex-col gap-2 hover:bg-purple-50">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <span className="text-sm">Find Matches</span>
            </Button>
          </Link>
          
          <Link href="/sessions">
            <Button variant="outline" className="h-full p-4 flex flex-col gap-2 hover:bg-blue-50">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Sessions</span>
            </Button>
          </Link>
          
          <Link href="/profile">
            <Button variant="outline" className="h-full p-4 flex flex-col gap-2 hover:bg-green-50">
              <Upload className="h-5 w-5 text-green-600" />
              <span className="text-sm">Upload Transcript</span>
            </Button>
          </Link>
          
          <Link href="/chat">
            <Button variant="outline" className="h-full p-4 flex flex-col gap-2 hover:bg-orange-50">
              <MessageSquare className="h-5 w-5 text-orange-600" />
              <span className="text-sm">Messages</span>
            </Button>
          </Link>
        </div>
      </div>
    </MagicCard>
  );
};

export const StatsCard = () => {
  const sessions = useSwap(s => s.sessions);
  const completedSessions = sessions.filter(s => (s as any).status === 'completed').length;
  const totalMinutes = sessions.reduce((acc, s) => acc + (s as any).minutes, 0);

  return (
    <MagicCard className="p-6 h-full" enableStars={true} enableSpotlight={true} enableMagnetism={false} glowColor="59, 130, 246">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Your Stats</h3>
        </div>
        
        <div className="space-y-4 flex-1">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Completed Sessions</span>
            <span className="font-semibold text-gray-900">{completedSessions}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Total Minutes</span>
            <span className="font-semibold text-gray-900">{totalMinutes}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Learning Hours</span>
            <span className="font-semibold text-gray-900">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</span>
          </div>
        </div>
      </div>
    </MagicCard>
  );
};

export const WelcomeCard = () => {
  const me = useSwap(s => s.me);
  
  return (
    <MagicCard className="p-8 h-full col-span-full" enableStars={true} enableSpotlight={true} enableMagnetism={false} glowColor="147, 51, 234">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-purple-100 rounded-2xl">
            <GraduationCap className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {me?.name?.split(" ")[0] || "there"}!
            </h1>
            <p className="text-gray-600 text-lg">
              Here's what's happening with your learning journey
            </p>
          </div>
        </div>
        
        <Link href="/matches">
          <Button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 text-lg">
            Find a Swap
          </Button>
        </Link>
      </div>
    </MagicCard>
  );
};