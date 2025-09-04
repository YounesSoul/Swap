
"use client";
import { useSwap } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function RequestsPage(){
  const {inbox,sent,acceptRequest,declineRequest,sendRequest,me}=useSwap(s=>({inbox:s.inbox,sent:s.sent,acceptRequest:s.acceptRequest,declineRequest:s.declineRequest,sendRequest:s.sendRequest,me:s.me}));
  const [toEmail,setToEmail]=useState(""); const [course,setCourse]=useState("MATH201"); const [minutes,setMinutes]=useState(60); const [note,setNote]=useState("");
  const submit=async(e:React.FormEvent)=>{e.preventDefault(); if(!me?.email) return alert("Sign in first"); if(!toEmail) return alert("Enter recipient email"); if(toEmail.toLowerCase()===me.email.toLowerCase()) return alert("You can't send a request to yourself"); await sendRequest(toEmail,course,minutes,note||undefined); setToEmail(""); setNote(""); alert("Request sent!");};
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Requests</h2>
      <Card>
        <CardHeader><CardTitle>New Request</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
            <Input placeholder="Recipient email" value={toEmail} onChange={e=>setToEmail(e.target.value)}/>
            <Input placeholder="Course" value={course} onChange={e=>setCourse(e.target.value)}/>
            <Input type="number" min={15} step={15} placeholder="Minutes" value={minutes} onChange={e=>setMinutes(parseInt(e.target.value||'60'))}/>
            <Button type="submit">Send</Button>
            <div className="md:col-span-4"><Input placeholder="Note (optional)" value={note} onChange={e=>setNote(e.target.value)}/></div>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Inbox</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {inbox.length===0 && <div className="text-gray-600">No incoming requests.</div>}
            {inbox.map((r:any)=>(
              <div key={r.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
                <div>
                  <div><strong>{r.courseCode}</strong> • {r.minutes||60}m</div>
                  <div className="text-xs text-gray-500">{r.createdAt||""} • status: {r.status}</div>
                </div>
                <div className="flex gap-2">
                  {r.status==='PENDING' ? (<>
                    <Button onClick={()=>acceptRequest(r.id)}>Accept</Button>
                    <Button variant="outline" onClick={()=>declineRequest(r.id)}>Decline</Button>
                  </>) : <span className="text-xs text-gray-600">{r.status}</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sent</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {sent.length===0 && <div className="text-gray-600">No sent requests.</div>}
            {sent.map((r:any)=>(
              <div key={r.id} className="flex items-center justify-between rounded-xl border px-3 py-2">
                <div>
                  <div><strong>{r.courseCode}</strong> • {r.minutes||60}m</div>
                  <div className="text-xs text-gray-500">{r.createdAt||""} • status: {r.status}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
