import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Clock,
  MessageSquare,
  Star,
  User,
} from "lucide-react";
import { toast } from "react-toastify";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import { swapAppRoutes } from "@/config/appRoutes";
import { createRating, getApiBase } from "@/lib/api";
import { useSwap, type SessionItem, type SwapState } from "@/lib/store";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import "@/styles/sessions.scss";

type Filter = "all" | "scheduled" | "completed" | "needs-scheduling";

type NormalizedSession = SessionItem & {
  teacher?: { id?: string; name?: string | null; email?: string | null; image?: string | null };
  learner?: { id?: string; name?: string | null; email?: string | null; image?: string | null };
};

type SessionCardProps = {
  session: NormalizedSession;
  currentEmail?: string | null;
  isRated: boolean;
  onSchedule: (session: NormalizedSession) => void;
  onComplete: (session: NormalizedSession) => void;
  onRate: (session: NormalizedSession) => void;
  completingId: string | null;
  schedulingId: string | null;
};

type ScheduleOverlayState = {
  session: NormalizedSession;
  value: string;
};

type RatingOverlayState = {
  session: NormalizedSession;
  teacher: { id?: string; email?: string | null; name?: string | null };
};

const isCompleted = (status?: string | null) => {
  const normalized = status?.toLowerCase?.() ?? "";
  return normalized === "done" || normalized === "completed";
};

const toLocalInputValue = (iso?: string | null) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

const SessionCard = ({
  session,
  currentEmail,
  isRated,
  onSchedule,
  onComplete,
  onRate,
  completingId,
  schedulingId,
}: SessionCardProps) => {
  const currentLower = currentEmail?.toLowerCase();
  const isLearner = session.learner?.email?.toLowerCase() === currentLower;
  const partner = isLearner ? session.teacher : session.learner;
  const partnerName = partner?.name ?? partner?.email ?? "Swap member";
  const partnerEmail = partner?.email ?? undefined;
  const sessionStatusCompleted = isCompleted(session.status);
  const needsScheduling = !session.startAt && !sessionStatusCompleted;
  const isScheduled = !!session.startAt && !sessionStatusCompleted;
  const schedulePending = schedulingId === session.id;
  const completePending = completingId === session.id;

  return (
    <article className="td-sessions__card">
      <header className="td-sessions__card-head">
        <div className="td-sessions__card-meta">
          <div className="td-sessions__avatar" aria-hidden="true">
            {(partnerName ?? "S").charAt(0).toUpperCase()}
          </div>
          <div>
            <h3>{session.courseCode}</h3>
            <p>
              <User size={14} aria-hidden="true" />
              <span>
                {isLearner ? "Teacher" : "Student"}: {partnerName}
              </span>
            </p>
            {partnerEmail ? <p className="td-sessions__card-email">{partnerEmail}</p> : null}
          </div>
        </div>
        <span
          className={`td-sessions__status${sessionStatusCompleted ? " td-sessions__status--done" : needsScheduling ? " td-sessions__status--pending" : " td-sessions__status--scheduled"}`}
        >
          {sessionStatusCompleted ? "Completed" : needsScheduling ? "Needs scheduling" : "Scheduled"}
        </span>
      </header>

      <dl className="td-sessions__details">
        <div>
          <dt>Duration</dt>
          <dd>
            <Clock size={14} aria-hidden="true" />
            <span>{session.minutes ?? 60} minutes</span>
          </dd>
        </div>
        {session.startAt ? (
          <div>
            <dt>Date</dt>
            <dd>
              <Calendar size={14} aria-hidden="true" />
              <span>{new Date(session.startAt).toLocaleDateString()}</span>
            </dd>
          </div>
        ) : null}
        {session.startAt ? (
          <div>
            <dt>Time</dt>
            <dd>{new Date(session.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</dd>
          </div>
        ) : null}
      </dl>

      {sessionStatusCompleted ? (
        <div className="td-sessions__pill td-sessions__pill--success">
          <CheckCircle2 size={16} aria-hidden="true" />
          <span>Great job! This session is wrapped.</span>
        </div>
      ) : needsScheduling ? (
        <div className="td-sessions__pill td-sessions__pill--warning">
          <CalendarClock size={16} aria-hidden="true" />
          <span>Pick a date and time so both of you are aligned.</span>
        </div>
      ) : null}

      <div className="td-sessions__actions">
        {partnerEmail ? (
          <a
            className="td-btn td-btn-outline td-sessions__action"
            href={`${swapAppRoutes.chat}?with=${encodeURIComponent(partnerEmail)}`}
          >
            <MessageSquare size={16} aria-hidden="true" />
            <span>Message</span>
          </a>
        ) : null}

        {needsScheduling ? (
          <button
            type="button"
            className="td-btn td-btn-lg td-sessions__action td-sessions__action--primary"
            onClick={() => onSchedule(session)}
            disabled={schedulePending}
          >
            <CalendarClock size={16} aria-hidden="true" />
            <span>{schedulePending ? "Saving…" : "Schedule"}</span>
          </button>
        ) : null}

        {isScheduled ? (
          <button
            type="button"
            className="td-btn td-btn-lg td-sessions__action td-sessions__action--complete"
            onClick={() => onComplete(session)}
            disabled={completePending}
          >
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>{completePending ? "Marking…" : "Mark as done"}</span>
          </button>
        ) : null}

        {sessionStatusCompleted ? (
          <a
            className="td-btn td-btn-outline td-sessions__action"
            href={`/ratings?userId=${encodeURIComponent(session.teacherId ?? "")}`}
          >
            <BookOpen size={16} aria-hidden="true" />
            <span>View ratings</span>
          </a>
        ) : null}

        {sessionStatusCompleted && isLearner && !isRated ? (
          <button
            type="button"
            className="td-btn td-btn-lg td-sessions__action td-sessions__action--rate"
            onClick={() => onRate(session)}
          >
            <Star size={16} aria-hidden="true" />
            <span>Rate teacher</span>
          </button>
        ) : null}

        {sessionStatusCompleted && isLearner && isRated ? (
          <div className="td-sessions__pill td-sessions__pill--rated">
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>Thanks for rating!</span>
          </div>
        ) : null}
      </div>
    </article>
  );
};

const Sessions = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSupabaseAuth();
  const me = useSwap((state: SwapState) => state.me);
  const sessions = useSwap((state: SwapState) => state.sessions) as NormalizedSession[];
  const scheduleSession = useSwap((state: SwapState) => state.scheduleSession);
  const completeSession = useSwap((state: SwapState) => state.completeSession);

  const [filter, setFilter] = useState<Filter>("all");
  const [ratedSessions, setRatedSessions] = useState<Set<string>>(new Set());
  const [scheduleOverlay, setScheduleOverlay] = useState<ScheduleOverlayState | null>(null);
  const [scheduleSavingId, setScheduleSavingId] = useState<string | null>(null);
  const [completeSavingId, setCompleteSavingId] = useState<string | null>(null);
  const [ratingOverlay, setRatingOverlay] = useState<RatingOverlayState | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [ratingReview, setRatingReview] = useState<string>("");
  const [ratingSaving, setRatingSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/signin?callbackUrl=${encodeURIComponent("/sessions")}`);
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (!scheduleOverlay?.session) {
      setScheduleSavingId(null);
    }
  }, [scheduleOverlay?.session]);

  useEffect(() => {
    let isCancelled = false;
    const run = async () => {
      if (!sessions || !me?.id) {
        setRatedSessions(new Set());
        return;
      }

      const apiBase = getApiBase();
      if (!apiBase) {
        setRatedSessions(new Set());
        return;
      }

      const candidateSessions = sessions.filter((entry) => isCompleted(entry.status) && entry.learner?.email && entry.learner.email.toLowerCase() === me.email?.toLowerCase());
      const ratedIds = new Set<string>();

      for (const session of candidateSessions) {
        try {
          const response = await fetch(`${apiBase}/ratings/session/${encodeURIComponent(session.id)}/exists?raterId=${encodeURIComponent(me.id)}`);
          if (!response.ok) {
            continue;
          }
          const data = await response.json();
          if (data?.exists) {
            ratedIds.add(session.id);
          }
        } catch (error) {
          console.error("Failed to check rating status", error);
        }
      }

      if (!isCancelled) {
        setRatedSessions(ratedIds);
      }
    };

    void run();
    return () => {
      isCancelled = true;
    };
  }, [sessions, me?.email, me?.id]);

  const isLoadingPage = authLoading || (!!user && !me);

  const stats = useMemo(() => {
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

    let totalMinutes = 0;
    let scheduled = 0;
    let completed = 0;
    let needsScheduling = 0;
    const courseCodes = new Set<string>();

    sessions.forEach((session) => {
      totalMinutes += session.minutes ?? 0;
      const done = isCompleted(session.status);
      if (done) {
        completed += 1;
      } else if (!session.startAt) {
        needsScheduling += 1;
      } else {
        scheduled += 1;
      }
      if (session.courseCode) {
        courseCodes.add(session.courseCode);
      }
    });

    return {
      total: sessions.length,
      scheduled,
      completed,
      totalHours: Math.round(totalMinutes / 60),
      uniqueCourses: courseCodes.size,
      needsScheduling,
    };
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    if (!sessions) {
      return [];
    }

    return sessions.filter((session) => {
      const done = isCompleted(session.status);
      if (filter === "completed") {
        return done;
      }
      if (filter === "needs-scheduling") {
        return !done && !session.startAt;
      }
      if (filter === "scheduled") {
        return !done && !!session.startAt;
      }
      return true;
    });
  }, [sessions, filter]);

  const openScheduleOverlay = (session: NormalizedSession) => {
    setScheduleOverlay({ session, value: toLocalInputValue(session.startAt) });
  };

  const openRatingOverlay = (session: NormalizedSession) => {
    if (!session.teacherId && !session.teacher?.id) {
      toast.error("We could not find the teacher for this session.");
      return;
    }

    setRatingOverlay({
      session,
      teacher: {
        id: session.teacherId ?? session.teacher?.id,
        email: session.teacher?.email,
        name: session.teacher?.name ?? session.teacher?.email,
      },
    });
    setRatingValue(5);
    setRatingReview("");
  };

  const handleScheduleSubmit = async () => {
    if (!scheduleOverlay) {
      return;
    }

    if (!scheduleOverlay.value) {
      toast.error("Select a date and time for the session.");
      return;
    }

    const iso = new Date(scheduleOverlay.value).toISOString();
    if (!iso || Number.isNaN(new Date(iso).getTime())) {
      toast.error("Please pick a valid date and time.");
      return;
    }

    setScheduleSavingId(scheduleOverlay.session.id);
    try {
      await scheduleSession(scheduleOverlay.session.id, iso);
      toast.success("Session scheduled");
      setScheduleOverlay(null);
    } catch (error) {
      console.error("Failed to schedule session", error);
      toast.error("Could not schedule this session.");
    } finally {
      setScheduleSavingId(null);
    }
  };

  const handleComplete = async (session: NormalizedSession) => {
    setCompleteSavingId(session.id);
    try {
      await completeSession(session.id);
      toast.success("Session marked as done");
    } catch (error) {
      console.error("Failed to mark session as done", error);
      toast.error("Could not complete this session.");
    } finally {
      setCompleteSavingId(null);
    }
  };

  const handleRatingSubmit = async () => {
    if (!ratingOverlay || !me?.id) {
      toast.error("We could not submit the rating.");
      return;
    }

    const teacherId = ratingOverlay.teacher.id;
    if (!teacherId) {
      toast.error("Missing teacher identifier for this session.");
      return;
    }

    setRatingSaving(true);
    try {
      const result = await createRating({
        raterId: me.id,
        ratedId: teacherId,
        sessionId: ratingOverlay.session.id,
        rating: ratingValue,
        review: ratingReview.trim() ? ratingReview.trim() : undefined,
        category: "course",
        skillOrCourse: ratingOverlay.session.courseCode,
      });

      if (result.ok) {
        toast.success("Thanks for rating your teacher");
        setRatedSessions((previous) => {
          const updated = new Set(previous);
          updated.add(ratingOverlay.session.id);
          return updated;
        });
        setRatingOverlay(null);
      } else {
        toast.error(result.data?.message ?? "Could not submit rating.");
      }
    } catch (error) {
      console.error("Failed to create rating", error);
      toast.error("Could not submit rating.");
    } finally {
      setRatingSaving(false);
    }
  };

  const suggestionFilters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: "All" },
    { key: "scheduled", label: "Scheduled" },
    { key: "completed", label: "Completed" },
    { key: "needs-scheduling", label: "Needs scheduling" },
  ];

  const pageBody = isLoadingPage ? (
    <section className="td-sessions td-sessions--loading">
      <div className="td-sessions__loading-card">
        <span className="td-sessions__loader" aria-hidden="true" />
        <p>Loading your sessions…</p>
      </div>
    </section>
  ) : (
    <main className="td-sessions" role="main">
      <div className="container">
        <section className="td-sessions__intro">
          <span className="td-sessions__badge">Sessions</span>
          <h1 className="td-sessions__title">Every learning exchange in one place</h1>
          <p className="td-sessions__text">
            Schedule upcoming swaps, wrap up completed ones, and keep your momentum going with quick actions.
          </p>
        </section>

        <section className="td-sessions__stats" aria-label="Session highlights">
          <article className="td-sessions__stat-card">
            <div className="td-sessions__stat-icon td-sessions__stat-icon--primary" aria-hidden="true">
              <BookOpen size={20} />
            </div>
            <div>
              <p>Total sessions</p>
              <strong>{stats.total}</strong>
            </div>
          </article>
          <article className="td-sessions__stat-card">
            <div className="td-sessions__stat-icon td-sessions__stat-icon--violet" aria-hidden="true">
              <Calendar size={20} />
            </div>
            <div>
              <p>Scheduled</p>
              <strong>{stats.scheduled}</strong>
            </div>
          </article>
          <article className="td-sessions__stat-card">
            <div className="td-sessions__stat-icon td-sessions__stat-icon--emerald" aria-hidden="true">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p>Completed</p>
              <strong>{stats.completed}</strong>
            </div>
          </article>
          <article className="td-sessions__stat-card">
            <div className="td-sessions__stat-icon td-sessions__stat-icon--amber" aria-hidden="true">
              <Clock size={20} />
            </div>
            <div>
              <p>Total hours</p>
              <strong>{stats.totalHours}</strong>
            </div>
          </article>
        </section>

        <section className="td-sessions__filters" aria-label="Filter sessions">
          <div className="td-sessions__filter-pills">
            {suggestionFilters.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`td-sessions__filter${filter === key ? " is-active" : ""}`}
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="td-sessions__list" aria-live="polite">
          {filteredSessions.length === 0 ? (
            <div className="td-sessions__empty">
              <span role="img" aria-label="No sessions">📚</span>
              <h2>{filter === "all" ? "No sessions yet" : "Nothing to show"}</h2>
              <p>
                {filter === "all"
                  ? "Send a request to start your first swap."
                  : "Try switching filters or booking a new session."}
              </p>
              <a className="td-btn td-btn-lg" href={swapAppRoutes.matches}>
                Find a swap partner
              </a>
            </div>
          ) : (
            <div className="td-sessions__grid">
              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  currentEmail={me?.email}
                  isRated={ratedSessions.has(session.id)}
                  onSchedule={openScheduleOverlay}
                  onComplete={handleComplete}
                  onRate={openRatingOverlay}
                  completingId={completeSavingId}
                  schedulingId={scheduleSavingId}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {scheduleOverlay ? (
        <div className="td-sessions__dialog" role="dialog" aria-modal="true">
          <div className="td-sessions__dialog-panel">
            <header className="td-sessions__dialog-head">
              <h2>Schedule session</h2>
              <p>
                Coordinate with {scheduleOverlay.session.teacher?.name ?? scheduleOverlay.session.teacher?.email ?? "your partner"} and lock in a time.
              </p>
            </header>
            <div className="td-sessions__dialog-body">
              <label className="td-sessions__dialog-label" htmlFor="schedule-datetime">
                Date &amp; time
              </label>
              <input
                id="schedule-datetime"
                type="datetime-local"
                value={scheduleOverlay.value}
                onChange={(event) => setScheduleOverlay({ session: scheduleOverlay.session, value: event.currentTarget.value })}
              />
            </div>
            <footer className="td-sessions__dialog-actions">
              <button
                type="button"
                className="td-btn td-btn-outline"
                onClick={() => setScheduleOverlay(null)}
                disabled={scheduleSavingId === scheduleOverlay.session.id}
              >
                Cancel
              </button>
              <button
                type="button"
                className="td-btn td-btn-lg td-sessions__action--primary"
                onClick={handleScheduleSubmit}
                disabled={scheduleSavingId === scheduleOverlay.session.id}
              >
                {scheduleSavingId === scheduleOverlay.session.id ? "Saving…" : "Save"}
              </button>
            </footer>
          </div>
        </div>
      ) : null}

      {ratingOverlay ? (
        <div className="td-sessions__dialog" role="dialog" aria-modal="true">
          <div className="td-sessions__dialog-panel">
            <header className="td-sessions__dialog-head">
              <h2>Rate your teacher</h2>
              <p>
                Share how the session went with {ratingOverlay.teacher.name ?? ratingOverlay.teacher.email ?? "your partner"}.
              </p>
            </header>
            <div className="td-sessions__dialog-body">
              <div className="td-sessions__rating-scale">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`td-sessions__rating-dot${ratingValue === value ? " is-active" : ""}`}
                    onClick={() => setRatingValue(value)}
                    aria-pressed={ratingValue === value}
                  >
                    <Star size={16} aria-hidden="true" />
                    <span>{value}</span>
                  </button>
                ))}
              </div>
              <label className="td-sessions__dialog-label" htmlFor="rating-feedback">
                Feedback (optional)
              </label>
              <textarea
                id="rating-feedback"
                rows={4}
                value={ratingReview}
                onChange={(event) => setRatingReview(event.currentTarget.value)}
                placeholder="What stood out during this session?"
              />
            </div>
            <footer className="td-sessions__dialog-actions">
              <button type="button" className="td-btn td-btn-outline" onClick={() => setRatingOverlay(null)} disabled={ratingSaving}>
                Cancel
              </button>
              <button
                type="button"
                className="td-btn td-btn-lg td-sessions__action--rate"
                onClick={handleRatingSubmit}
                disabled={ratingSaving}
              >
                {ratingSaving ? "Submitting…" : "Submit rating"}
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </main>
  );

  return (
    <>
      <DashboardNavigation />
      {pageBody}
    </>
  );
};

export default Sessions;
