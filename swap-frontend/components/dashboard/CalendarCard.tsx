"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MagicCard } from "@/components/ui/magic-bento";
import { useSwap } from "@/lib/store";
import { Calendar as BigCalendar, dateFnsLocalizer, type Event as RBCEvent } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { Calendar as CalendarIcon, ArrowRight } from "lucide-react";
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
    <MagicCard className="h-full overflow-hidden" enableStars={true} enableSpotlight={true} enableMagnetism={false} glowColor="99, 102, 241">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <CalendarIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Your Schedule</h3>
          </div>
          <button
            onClick={() => router.push("/calendar")}
            className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View full calendar
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-6 flex-1">
          <div className="h-[400px] w-full">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              views={["month"]}
              popup
              style={{ height: "100%" }}
              onSelectEvent={(event: RBCEvent) => router.push("/sessions")}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </MagicCard>
  );
}
