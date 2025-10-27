"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSwap } from "@/lib/store";
import { toast } from "sonner";

export default function MatchesPage() {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"skill" | "course">("skill");
  const search = useSwap((s) => s.searchTeachers);
  const results = useSwap((s) => s.searchResults);
  const sendRequest = useSwap((s) => s.sendRequest); // returns { ok, error? }
  const me = useSwap((s) => s.me);
  const router = useRouter();
  const [bookingEmail, setBookingEmail] = useState<string | null>(null);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    await search(mode === "skill" ? { skill: q.trim() } : { course: q.trim().toUpperCase() });
  }

  async function onBook(email: string, label: string) {
    setBookingEmail(email);
    const res = await sendRequest(email, label, 60, "Can we do a 1h session?");
    setBookingEmail(null);

    if (res.ok) {
      toast.success("Request sent", { description: "You can track it in Requests." });
      router.push("/requests");
    } else {
      // If backend blocked duplicate, it will send our specific message
      const msg = res.error || "Could not send request.";
      toast.error(msg);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Find a teacher</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSearch} className="flex gap-2">
            <select
              className="rounded-md border px-2"
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
            >
              <option value="skill">Skill</option>
              <option value="course">Course</option>
            </select>
            <Input
              placeholder={mode === "skill" ? "chess, python..." : "MATH305, CS101..."}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {results.length === 0 && (
          <div className="text-sm text-gray-600">
            No results yet. Try searching for a skill like “chess”.
          </div>
        )}

        {results.map((r: any) => {
          const isMe = r.user.email?.toLowerCase() === me?.email?.toLowerCase();
          const label = (r.course?.code || (r.skills?.[0]?.name ?? "SKILL")).toString();

          return (
            <Card key={r.user.email}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <div className="font-medium">{r.user.name || r.user.email}</div>
                  <div className="text-xs text-gray-600">{r.user.email}</div>
                  {r.skills && (
                    <div className="mt-1 text-xs">
                      Skills: {r.skills.map((s: any) => `${s.name} (${s.level})`).join(", ")}
                    </div>
                  )}
                  {r.course && (
                    <div className="mt-1 text-xs">
                      Aced: {r.course.code} ({r.course.grade})
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={isMe}
                    onClick={() =>
                      window.open(`/chat?with=${encodeURIComponent(r.user.email)}`, "_self")
                    }
                  >
                    {isMe ? "It's you" : "Message"}
                  </Button>

                  <Button
                    disabled={isMe || bookingEmail === r.user.email}
                    onClick={() => onBook(r.user.email, label)}
                  >
                    {bookingEmail === r.user.email ? "Booking..." : "Book"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
