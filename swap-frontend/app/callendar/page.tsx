"use client";
import { useEffect, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Event as RBCEvent } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSwap } from "@/lib/store";

const locales = { "en-US": require("date-fns/locale/en-US") };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date()), getDay, locales });

export default function CalendarPage() {
  const sessions = useSwap(s => s.sessions);
  const events: RBCEvent[] = useMemo(
    () =>
      (sessions || [])
        .filter((s:any) => s.startAt && s.status !== "done")
        .map((s:any) => ({
          title: `${s.courseCode} (${s.minutes}m)`,
          start: new Date(s.startAt),
          end: s.endAt ? new Date(s.endAt) : new Date(new Date(s.startAt).getTime() + s.minutes * 60000),
          allDay: false,
          resource: s,
        })),
    [sessions]
  );

  useEffect(()=> {
    // ensure calendar has height style
    document.body.classList.add("rbc-calendar-mounted");
    return () => document.body.classList.remove("rbc-calendar-mounted");
  }, []);

  return (
    <div className="min-h-[70vh] rounded-2xl border bg-white p-3">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "70vh" }}
      />
    </div>
  );
}
