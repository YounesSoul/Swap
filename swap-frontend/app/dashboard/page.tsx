"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSwap } from "@/lib/store";
import CalendarCard from "@/components/dashboard/CalendarCard";

export default function Dashboard(){
  const me = useSwap(s => s.me);
  const tokenBalance = useSwap(s => s.tokenBalance);
  const sessions = useSwap(s => s.sessions);

  const next = sessions[0];
  const otherEmail = next
    ? (('teacher' in next && (next as any).teacher?.email && (next as any).teacher?.email !== me?.email)
        ? (next as any).teacher.email
        : (next as any).learner?.email)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Welcome {me?.name?.split(" ")[0] || "to Swap"}</h2>
        <Link href="/matches"><Button>Find a Swap</Button></Link>
      </div>

      {/* top row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Next Session</CardTitle></CardHeader>
          <CardContent className="text-sm">
            {!next ? (
              <div className="text-gray-600">You have no upcoming sessions yet.</div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-medium">{(next as any).courseCode} • {(next as any).minutes}m</div>
                  <div className="text-gray-600">
                    With {otherEmail === me?.email ? "yourself" : otherEmail}
                  </div>
                </div>
                {otherEmail && (
                  <Link href={`/chat?with=${encodeURIComponent(otherEmail)}`}>
                    <Button>Message</Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Your Balance</CardTitle></CardHeader>
          <CardContent className="text-sm">
            <div className="text-3xl font-bold">{tokenBalance} token{tokenBalance===1?"":"s"}</div>
            <div className="text-gray-600">Teach 60m → earn 1 token</div>
          </CardContent>
        </Card>
      </div>

      {/* calendar card */}
      <CalendarCard />
    </div>
  );
}
