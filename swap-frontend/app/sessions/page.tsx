"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSwap } from "@/lib/store";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SessionsPage(){
  const sessions = useSwap(s => s.sessions);
  const me = useSwap(s => s.me);
  const complete = useSwap(s => s.completeSession);
  const schedule = useSwap(s => s.scheduleSession);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dt, setDt] = useState<string>("");

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
            return (
              <div key={s.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
                <div className="space-y-0.5">
                  <div>{s.courseCode} • {s.minutes}m • {s.status}</div>
                  {s.startAt && <div className="text-xs text-gray-600">Starts {new Date(s.startAt).toLocaleString()}</div>}
                </div>
                <div className="flex gap-2">
                  {other && <Link href={`/chat?with=${encodeURIComponent(other)}`}><Button variant="outline">Message</Button></Link>}
                  {!isDone && !s.startAt && (
                    <Button variant="outline" onClick={()=>{ setOpenId(s.id); setDt(""); }}>
                      Schedule
                    </Button>
                  )}
                  {!isDone && <Button onClick={()=>complete(s.id)}>Mark as done</Button>}
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
    </div>
  );
}
