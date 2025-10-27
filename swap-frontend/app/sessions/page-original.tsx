"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSwap } from "@/lib/store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RatingModal } from "@/components/ui/RatingModal";
import { toast } from "sonner";

export default function SessionsPage(){
  const sessions = useSwap(s => s.sessions);
  const me = useSwap(s => s.me);
  const complete = useSwap(s => s.completeSession);
  const schedule = useSwap(s => s.scheduleSession);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dt, setDt] = useState<string>("");
  const [ratedSessions, setRatedSessions] = useState<Set<string>>(new Set());
  
  // Rating modal state
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    session?: any;
    teacher?: any;
  }>({ isOpen: false });

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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sessions</h2>
      <Card>
        <CardHeader><CardTitle>Upcoming</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          {(!sessions || sessions.length===0) && <div className="text-gray-600">No upcoming sessions.</div>}
          {sessions?.map((s:any)=> {
            const other = s.teacher?.email === me?.email ? s.learner?.email : s.teacher?.email;
            const isDone = s.status === "done";
            const isLearner = s.learner?.email === me?.email;
            const teacher = s.teacher;
            
            return (
              <div key={s.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
                <div className="space-y-0.5">
                  <div>{s.courseCode} • {s.minutes}m • {s.status}</div>
                  {s.startAt && <div className="text-xs text-gray-600">Starts {new Date(s.startAt).toLocaleString()}</div>}
                  {isDone && <div className="text-xs text-green-600">Session completed</div>}
                </div>
                <div className="flex gap-2">
                  {other && <Link href={`/chat?with=${encodeURIComponent(other)}`}><Button variant="outline">Message</Button></Link>}
                  {!isDone && !s.startAt && (
                    <Button variant="outline" onClick={()=>{ setOpenId(s.id); setDt(""); }}>
                      Schedule
                    </Button>
                  )}
                  {!isDone && <Button onClick={()=>complete(s.id)}>Mark as done</Button>}
                  
                  {/* View Teacher Ratings button for completed sessions */}
                  {isDone && (
                    <Link href={`/ratings?userId=${s.teacherId}`}>
                      <Button variant="outline" className="text-sm">
                        👁️ View Teacher Ratings
                      </Button>
                    </Link>
                  )}
                  
                  {/* Rating button for learners on completed sessions */}
                  {isDone && isLearner && !ratedSessions.has(s.id) && (
                    <Button 
                      variant="outline"
                      className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border-yellow-200"
                      onClick={() => {
                        console.log('Session data:', s);
                        console.log('Teacher data:', teacher);
                        console.log('Current user (me):', me);
                        
                        // Get teacher data with proper ID from session
                        const teacherData = {
                          id: s.teacherId,
                          name: s.teacher?.name || s.teacher?.email || 'Unknown Teacher',
                          email: s.teacher?.email || 'unknown@email.com'
                        };
                        
                        setRatingModal({
                          isOpen: true,
                          session: s,
                          teacher: teacherData
                        });
                      }}
                    >
                      ⭐ Rate Teacher
                    </Button>
                  )}
                  
                  {/* Show "Rated" indicator if already rated */}
                  {isDone && isLearner && ratedSessions.has(s.id) && (
                    <div className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
                      ✓ Rated
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Simple inline scheduler */}
      {openId && (
        <Card className="max-w-md">
          <CardHeader><CardTitle>Pick date & time</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <input
              type="datetime-local"
              className="w-full rounded-md border px-3 py-2"
              value={dt}
              onChange={e=>setDt(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={()=>{ if(dt){ schedule(openId, new Date(dt).toISOString()); setOpenId(null);} }}>Save</Button>
              <Button variant="outline" onClick={()=>setOpenId(null)}>Cancel</Button>
            </div>
            <div className="text-xs text-gray-600">You’ll get a browser notification 10 minutes before.</div>
          </CardContent>
        </Card>
      )}

      {/* Rating Modal */}
      {ratingModal.isOpen && ratingModal.session && ratingModal.teacher && (
        <RatingModal
          isOpen={ratingModal.isOpen}
          onClose={() => {
            setRatingModal({ isOpen: false });
            // Refresh the rated sessions list after closing modal
            checkRatedSessions();
          }}
          user={{
            id: ratingModal.teacher.id,
            name: ratingModal.teacher.name || ratingModal.teacher.email,
            email: ratingModal.teacher.email
          }}
          sessionId={ratingModal.session.id}
          skillOrCourse={ratingModal.session.courseCode}
          category="course"
          currentUserId={ratingModal.session.learnerId} // Pass the actual learner ID
        />
      )}
    </div>
  );
}
