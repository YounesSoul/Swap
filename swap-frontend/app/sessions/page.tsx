"use client";
import React, { useState, useEffect } from "react";
import { useSwap } from "@/lib/store";
import { RatingModal } from "@/components/ui/RatingModal";
import { SessionCard } from "@/components/sessions/SessionCard";
import { SimpleSessionStats } from "@/components/sessions/SimpleSessionStats";
import { SchedulingModal } from "@/components/sessions/SchedulingModal";
import { toast } from "sonner";

export default function SessionsPage() {
  const sessions = useSwap((s) => s.sessions);
  const me = useSwap((s) => s.me);
  const complete = useSwap((s) => s.completeSession);
  const schedule = useSwap((s) => s.scheduleSession);
  
  const [ratedSessions, setRatedSessions] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>("all");
  const [schedulingModal, setSchedulingModal] = useState<{
    isOpen: boolean;
    session?: any;
  }>({ isOpen: false });
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    session?: any;
    teacher?: any;
  }>({ isOpen: false });
  const [loading, setLoading] = useState(false);

  // Check if user has already rated this session
  const checkIfRated = async (sessionId: string) => {
    if (!me?.id) return false;
    try {
      const response = await fetch(`http://localhost:4000/ratings/session/${sessionId}/exists?raterId=${me.id}`, {
        credentials: 'include'
      });
      const result = await response.json();
      return result.exists;
    } catch (error) {
      return false;
    }
  };

  // Check all completed sessions for existing ratings
  const checkRatedSessions = async () => {
    if (!sessions || !me?.id) return;
    
    const completedSessions = sessions.filter((s: any) => s.status === 'done' && s.learner?.email === me.email);
    const ratedSessionIds = new Set<string>();
    
    for (const session of completedSessions) {
      const isRated = await checkIfRated(session.id);
      if (isRated) {
        ratedSessionIds.add(session.id);
      }
    }
    
    setRatedSessions(ratedSessionIds);
  };

  // Check rated sessions when component mounts or sessions change
  useEffect(() => {
    checkRatedSessions();
  }, [sessions, me]);

  // Calculate session stats
  const stats = React.useMemo(() => {
    if (!sessions) {
      return {
        total: 0,
        scheduled: 0,
        completed: 0,
        totalHours: 0,
        uniqueCourses: 0,
        needsScheduling: 0,
      };
    }

    const scheduled = sessions.filter((s: any) => s.startAt && s.status !== 'done').length;
    const completed = sessions.filter((s: any) => s.status === 'done').length;
    const totalMinutes = sessions.reduce((acc: number, s: any) => acc + s.minutes, 0);
    const uniqueCourses = new Set(sessions.map((s: any) => s.courseCode)).size;
    const needsScheduling = sessions.filter((s: any) => !s.startAt && s.status !== 'done').length;

    return {
      total: sessions.length,
      scheduled,
      completed,
      totalHours: Math.round(totalMinutes / 60),
      uniqueCourses,
      needsScheduling,
    };
  }, [sessions]);

  // Filter sessions
  const filteredSessions = React.useMemo(() => {
    if (!sessions) return [];
    
    switch (filter) {
      case "scheduled":
        return sessions.filter((s: any) => s.startAt && s.status !== 'done');
      case "completed":
        return sessions.filter((s: any) => s.status === 'done');
      case "needs-scheduling":
        return sessions.filter((s: any) => !s.startAt && s.status !== 'done');
      default:
        return sessions;
    }
  }, [sessions, filter]);

  // Handle scheduling
  const handleSchedule = (sessionId: string) => {
    const session = sessions?.find((s: any) => s.id === sessionId);
    if (session) {
      setSchedulingModal({ isOpen: true, session });
    }
  };

  // Handle schedule submit
  const handleScheduleSubmit = async (sessionId: string, dateTime: string) => {
    setLoading(true);
    try {
      await schedule(sessionId, dateTime);
      setSchedulingModal({ isOpen: false });
      toast.success("Session scheduled successfully!");
    } catch (error) {
      toast.error("Failed to schedule session");
    } finally {
      setLoading(false);
    }
  };

  // Handle completion
  const handleComplete = async (sessionId: string) => {
    try {
      await complete(sessionId);
      toast.success("Session marked as completed!");
    } catch (error) {
      toast.error("Failed to complete session");
    }
  };

  // Handle rating
  const handleRate = (session: any, teacher: any) => {
    setRatingModal({
      isOpen: true,
      session,
      teacher,
    });
  };

  if (!me) {
    return <div className="p-6">Please sign in to view your sessions.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-6 py-8 max-w-7xl space-y-6">
        {/* Stats Overview */}
        <SimpleSessionStats stats={stats} onFilterChange={setFilter} />

        {/* Sessions List */}
        <div className="space-y-6">
          {filteredSessions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="text-gray-500 text-lg font-semibold">
                {filter === "all" ? "No sessions yet." : `No ${filter.replace('-', ' ')} sessions.`}
              </div>
              <div className="text-gray-400 text-sm mt-2 font-medium">
                {filter === "all" 
                  ? "Create a request to start learning!" 
                  : "Try changing the filter to see other sessions."
                }
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredSessions.map((session: any) => {
                const isLearner = session.learner?.email === me.email;
                const isRated = ratedSessions.has(session.id);

                return (
                  <SessionCard
                    key={session.id}
                    session={session}
                    currentUser={me}
                    isRated={isRated}
                    onSchedule={handleSchedule}
                    onComplete={handleComplete}
                    onRate={handleRate}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Scheduling Modal */}
        {schedulingModal.isOpen && schedulingModal.session && (
          <SchedulingModal
            isOpen={schedulingModal.isOpen}
            onClose={() => setSchedulingModal({ isOpen: false })}
            onSchedule={handleScheduleSubmit}
            session={schedulingModal.session}
            isLearner={schedulingModal.session.learner?.email === me.email}
            loading={loading}
          />
        )}

        {/* Rating Modal */}
        {ratingModal.isOpen && ratingModal.session && ratingModal.teacher && (
          <RatingModal
            isOpen={ratingModal.isOpen}
            onClose={() => {
              setRatingModal({ isOpen: false });
              checkRatedSessions();
            }}
            user={{
              id: ratingModal.teacher.id,
              name: ratingModal.teacher.name || ratingModal.teacher.email,
              email: ratingModal.teacher.email,
            }}
            sessionId={ratingModal.session.id}
            skillOrCourse={ratingModal.session.courseCode}
            category="course"
            currentUserId={ratingModal.session.learnerId}
          />
        )}
      </div>
    </div>
  );
}