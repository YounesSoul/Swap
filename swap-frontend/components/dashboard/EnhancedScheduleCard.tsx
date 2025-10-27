"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { useSwap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  User,
  BookOpen,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { format, isToday, isTomorrow, addDays, startOfWeek, endOfWeek } from "date-fns";

export const EnhancedScheduleCard: React.FC = () => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const sessions = useSwap(s => s.sessions);
  const me = useSwap(s => s.me);

  // Process sessions data
  const processedSessions = useMemo(() => {
    const upcoming = sessions
      ?.filter((s: any) => s.startAt && new Date(s.startAt) > new Date() && s.status !== 'completed')
      ?.sort((a: any, b: any) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
      ?.slice(0, 3) || [];

    const thisWeek = sessions?.filter((s: any) => {
      if (!s.startAt) return false;
      const sessionDate = new Date(s.startAt);
      const weekStart = startOfWeek(new Date());
      const weekEnd = endOfWeek(new Date());
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    }).length || 0;

    const nextSession = upcoming[0];

    return {
      upcoming,
      nextSession,
      thisWeek,
      hasUpcoming: upcoming.length > 0
    };
  }, [sessions]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    gsap.fromTo(
      card,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
    );
  }, []);

  const getSessionTime = (session: any) => {
    const date = new Date(session.startAt);
    if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow at ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d, h:mm a');
  };

  const getOtherParticipant = (session: any) => {
    if (!session.teacher || !session.learner) return "Unknown";
    return session.teacher.email === me?.email ? 
      session.learner.name || session.learner.email : 
      session.teacher.name || session.teacher.email;
  };

  const getSessionStatus = (session: any) => {
    if (session.status === 'completed') return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' };
    if (session.status === 'scheduled') return { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' };
    return { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' };
  };

  return (
    <div
      ref={cardRef}
      className="h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl border border-indigo-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500"
    >
      {/* Header */}
      <div className="p-6 border-b border-indigo-100/50 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Your Schedule</h3>
              <p className="text-indigo-100 text-sm">
                {processedSessions.thisWeek} sessions this week
              </p>
            </div>
          </div>
          
          <Link href="/sessions">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 text-sm px-3 py-2"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1">
        {!processedSessions.hasUpcoming ? (
          // No upcoming sessions
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 bg-indigo-50 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-indigo-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No upcoming sessions</h4>
            <p className="text-gray-600 text-sm mb-6">
              Schedule a session to start learning or teaching
            </p>
            <Link href="/matches">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-6">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </Link>
          </div>
        ) : (
          // Upcoming sessions
          <div className="space-y-4">
            {/* Next session highlight */}
            {processedSessions.nextSession && (
              <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">Next Session</span>
                    </div>
                    <h4 className="font-bold text-lg mb-1">
                      {processedSessions.nextSession.courseCode}
                    </h4>
                    <p className="text-indigo-100 text-sm">
                      {getSessionTime(processedSessions.nextSession)}
                    </p>
                    <p className="text-indigo-100 text-sm">
                      with {getOtherParticipant(processedSessions.nextSession)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href={`/chat?with=${encodeURIComponent(getOtherParticipant(processedSessions.nextSession))}`}>
                      <Button 
                        variant="outline"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-sm px-3 py-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming sessions list */}
            <div className="space-y-3">
              <h5 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                Upcoming Sessions
              </h5>
              
              {processedSessions.upcoming.slice(1).map((session: any, index: number) => {
                const StatusIcon = getSessionStatus(session).icon;
                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                    onClick={() => router.push('/sessions')}
                  >
                    <div className={`p-2 rounded-lg ${getSessionStatus(session).bg}`}>
                      <StatusIcon className={`h-4 w-4 ${getSessionStatus(session).color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">
                          {session.courseCode}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          {session.minutes}min
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {getSessionTime(session)}
                      </p>
                    </div>
                    
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                );
              })}
              
              {processedSessions.upcoming.length > 3 && (
                <Link href="/sessions">
                  <Button 
                    variant="outline" 
                    className="w-full text-sm"
                  >
                    View all {processedSessions.upcoming.length} sessions
                  </Button>
                </Link>
              )}
            </div>

            {/* Quick actions */}
            <div className="pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/matches">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center gap-2 hover:bg-indigo-50 hover:border-indigo-200 text-sm px-3 py-2"
                  >
                    <Plus className="h-4 w-4" />
                    Schedule
                  </Button>
                </Link>
                <Link href="/calendar">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center gap-2 hover:bg-purple-50 hover:border-purple-200 text-sm px-3 py-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Calendar
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};