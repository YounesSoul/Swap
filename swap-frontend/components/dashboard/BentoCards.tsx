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
  History,
  Inbox,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export const NextSessionCard = () => {
  const sessions = useSwap(s => s.sessions);
  const me = useSwap(s => s.me);
  const next = sessions[0];
  
  const otherUser = next
    ? (('teacher' in next && (next as any).teacher?.email && (next as any).teacher?.email !== me?.email)
        ? (next as any).teacher
        : (next as any).learner)
    : null;

  const displayName = otherUser?.name || otherUser?.email;
  const otherEmail = otherUser?.email;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-blue-600">Upcoming Sessions</h3>
      </div>
      
      {!next ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="p-4 bg-gray-50 rounded-full mb-4">
            <Calendar className="h-12 w-12 text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-400 mb-4">No upcoming sessions scheduled.</p>
          <Link href="/matches">
            <Button className="bg-blue-600 hover:bg-blue-700 text-sm font-semibold">
              Schedule Session
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-xl font-bold text-gray-900 mb-2">
              {(next as any).courseCode}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-2">
              <Clock className="h-4 w-4" />
              <span>{(next as any).minutes} minutes</span>
            </div>
            <div className="text-sm font-medium text-gray-500">
              with {otherEmail === me?.email ? "yourself" : displayName}
            </div>
          </div>
          
          {otherEmail && (
            <Link href={`/chat?with=${encodeURIComponent(otherEmail)}`}>
              <Button className="w-full gap-2 font-semibold" variant="outline">
                <MessageSquare className="h-4 w-4" />
                Send Message
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export const BalanceCard = () => {
  const tokenBalance = useSwap(s => s.tokenBalance);

  return (
    <MagicCard className="p-6 h-full" enableStars={true} enableSpotlight={true} enableMagnetism={false} glowColor="107, 114, 128">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Token Balance
          </p>
        </div>
        
        <div className="flex items-center justify-between flex-1">
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {tokenBalance}
              <span className="text-base font-medium ml-2 text-gray-500">
                token{tokenBalance === 1 ? "" : "s"}
              </span>
            </div>
            <div className="text-sm font-medium text-gray-500">
              Teach 60 minutes → Earn 1 token
            </div>
          </div>
        </div>
      </div>
    </MagicCard>
  );
};

export const QuickActionsCard = () => {
  return (
    <MagicCard className="p-6 h-full" enableStars={true} enableSpotlight={true} enableMagnetism={false} glowColor="59, 130, 246">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Quick Actions
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 flex-1">
          <Link href="/matches">
            <Button variant="outline" className="h-full p-4 flex flex-col gap-2 hover:bg-blue-50 font-semibold">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Find Matches</span>
            </Button>
          </Link>
          
          <Link href="/sessions">
            <Button variant="outline" className="h-full p-4 flex flex-col gap-2 hover:bg-blue-50 font-semibold">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Sessions</span>
            </Button>
          </Link>
          
          <Link href="/profile">
            <Button variant="outline" className="h-full p-4 flex flex-col gap-2 hover:bg-blue-50 font-semibold">
              <Upload className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Upload Transcript</span>
            </Button>
          </Link>
          
          <Link href="/chat">
            <Button variant="outline" className="h-full p-4 flex flex-col gap-2 hover:bg-blue-50 font-semibold">
              <MessageSquare className="h-5 w-5 text-blue-600" />
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
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Your Stats
          </p>
        </div>
        
        <div className="space-y-3 flex-1">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-500">Completed Sessions</span>
            <span className="font-bold text-gray-900">{completedSessions}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-500">Total Minutes</span>
            <span className="font-bold text-gray-900">{totalMinutes}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-500">Learning Hours</span>
            <span className="font-bold text-gray-900">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</span>
          </div>
        </div>
      </div>
    </MagicCard>
  );
};

export const WelcomeCard = () => {
  const me = useSwap(s => s.me);
  const firstName = me?.name?.split(" ")[0] || me?.email?.split("@")[0] || "there";
  
  return (
    <MagicCard className="p-6 h-full col-span-full" enableStars={true} enableSpotlight={true} enableMagnetism={false} glowColor="59, 130, 246">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <GraduationCap className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back, {firstName}!
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Here's what's happening with your learning journey
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Version
          </p>
          <p className="text-sm font-bold text-gray-700">
            v2.0.6
          </p>
        </div>
      </div>
    </MagicCard>
  );
};

export const PendingRequestsCard = () => {
  const inbox = useSwap(s => s.inbox);
  const pendingCount = inbox.filter(r => r.status === 'PENDING').length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Inbox className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-blue-600">Pending Requests</h3>
        </div>
        <div className="px-3 py-1 bg-blue-50 rounded-full">
          <span className="text-blue-600 font-bold text-sm">{pendingCount}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {pendingCount === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-medium text-gray-400">No pending requests</p>
          </div>
        ) : (
          inbox.filter(r => r.status === 'PENDING').slice(0, 3).map((req) => (
            <div key={req.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{req.courseCode}</p>
                  <p className="text-xs text-gray-500">{req.minutes} minutes</p>
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))
        )}
        
        {pendingCount > 0 && (
          <Link href="/requests">
            <Button variant="outline" className="w-full mt-2 font-semibold text-sm">
              View All Requests
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export const LatestSessionsCard = () => {
  const sessions = useSwap(s => s.sessions);
  const recentSessions = sessions.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <History className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-blue-600">Latest Sessions</h3>
        </div>
        <div className="px-3 py-1 bg-gray-50 rounded-full">
          <span className="text-gray-600 font-bold text-sm">{sessions.length}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {recentSessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm font-medium text-gray-400">No sessions yet</p>
          </div>
        ) : (
          recentSessions.map((session: any) => (
            <div key={session.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{session.courseCode}</p>
                  <p className="text-xs text-gray-500">{session.minutes} minutes</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-semibold ${
                  session.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {session.status}
                </div>
              </div>
            </div>
          ))
        )}
        
        {sessions.length > 0 && (
          <Link href="/sessions">
            <Button variant="outline" className="w-full mt-2 font-semibold text-sm">
              View All Sessions
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export const ScheduleCalendarCard = () => {
  const sessions = useSwap(s => s.sessions);
  const me = useSwap(s => s.me);
  
  // Get upcoming sessions
  const upcomingSessions = sessions
    .filter((s: any) => s.status === 'scheduled' && s.startAt)
    .slice(0, 5);

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDateNumber = (date: Date) => {
    return date.getDate();
  };

  // Generate next 7 days
  const today = new Date();
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const hasSessionOnDate = (date: Date) => {
    return upcomingSessions.some((session: any) => {
      const sessionDate = new Date(session.startAt);
      return sessionDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-blue-600">Schedule</h3>
        </div>
        
        <div className="flex gap-1">
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Mini Calendar Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {nextSevenDays.map((date, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xs font-medium text-gray-400 mb-1">
                {getDayName(date)}
              </span>
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors
                ${isToday(date) ? 'bg-blue-600 text-white' : 
                  hasSessionOnDate(date) ? 'bg-blue-100 text-blue-600' : 
                  'bg-gray-50 text-gray-600 hover:bg-gray-100'}
              `}>
                {getDateNumber(date)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions List */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Upcoming Sessions
        </p>
        
        {upcomingSessions.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm font-medium text-gray-400">No upcoming sessions</p>
          </div>
        ) : (
          upcomingSessions.slice(0, 3).map((session: any) => (
            <div key={session.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{session.courseCode}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(session.startAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <Clock className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))
        )}
        
        {upcomingSessions.length > 0 && (
          <Link href="/sessions">
            <Button variant="outline" className="w-full mt-2 font-semibold text-sm">
              View Calendar
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};