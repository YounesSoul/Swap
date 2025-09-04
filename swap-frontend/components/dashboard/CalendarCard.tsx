"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSwap } from "@/lib/store";
import { Calendar, dateFnsLocalizer, type Event as RBCEvent } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date()), getDay, locales });

export default function CalendarCard() {
  const router = useRouter();
  const sessions = useSwap((s) => s.sessions);
  const me = useSwap((s) => s.me);

  const events: RBCEvent[] = useMemo(
    () =>
      (sessions || [])
        .filter((s: any) => s.startAt && s.status !== "done")
        .map((s: any) => {
          const start = new Date(s.startAt);
          const end = s.endAt ? new Date(s.endAt) : new Date(start.getTime() + s.minutes * 60000);
          const other =
            s.teacher?.email === me?.email ? s.learner?.email ?? "Student" : s.teacher?.email ?? "Student";
          return {
            title: `${s.courseCode} • ${other}`,
            start,
            end,
            allDay: false,
            resource: s,
          };
        }),
    [sessions, me?.email]
  );

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Your Schedule</CardTitle>
        <button
          onClick={() => router.push("/calendar")}
          className="text-sm text-gray-600 underline hover:text-gray-900"
        >
          Open full calendar
        </button>
      </CardHeader>
      <CardContent>
        <div className="rounded-2xl border bg-white p-2">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="month"
            views={["month"]}
            popup
            style={{ height: 320 }}
            onSelectEvent={(e) => router.push("/sessions")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
