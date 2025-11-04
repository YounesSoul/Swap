import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import { useSwap, type SessionItem, type RequestItem, type SwapState } from "@/lib/store";
import { swapAppRoutes } from "@/config/appRoutes";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import "@/styles/dashboard.scss";

const formatDateLabel = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const formatTimeLabel = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const getSessionPartner = (session: SessionItem, currentEmail?: string | null) => {
  if (!currentEmail) {
    return session.teacher?.name ?? session.teacher?.email ?? session.learner?.email ?? "Partner";
  }

  const normalized = currentEmail.toLowerCase();
  if (session.teacher?.email && session.teacher.email.toLowerCase() !== normalized) {
    return session.teacher.name ?? session.teacher.email;
  }
  if (session.learner?.email && session.learner.email.toLowerCase() !== normalized) {
    return session.learner.name ?? session.learner.email;
  }
  return session.teacher?.name ?? session.teacher?.email ?? session.learner?.email ?? "You";
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSupabaseAuth();

  const me = useSwap((state: SwapState) => state.me);
  const sessions = useSwap((state: SwapState) => state.sessions);
  const inbox = useSwap((state: SwapState) => state.inbox);
  const tokenBalance = useSwap((state: SwapState) => state.tokenBalance);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/signin?callbackUrl=${encodeURIComponent("/dashboard")}`);
    }
  }, [authLoading, navigate, user]);

  const scheduledSessions = useMemo(() => {
    return [...sessions]
      .filter((session) => session.status === "scheduled" && session.startAt)
      .sort((a, b) => new Date(a.startAt ?? 0).getTime() - new Date(b.startAt ?? 0).getTime());
  }, [sessions]);

  const recentSessions = useMemo(() => {
    return [...sessions]
      .sort((a, b) => {
        const aTime = new Date(a.startAt ?? a.endAt ?? 0).getTime();
        const bTime = new Date(b.startAt ?? b.endAt ?? 0).getTime();
        return bTime - aTime;
      })
      .slice(0, 3);
  }, [sessions]);

  const nextSession = scheduledSessions[0];

  const pendingRequests = useMemo(
    () => inbox.filter((request: RequestItem) => request.status === "PENDING"),
    [inbox]
  );

  const upcomingSessions = useMemo(() => scheduledSessions.slice(0, 5), [scheduledSessions]);

  const calendarDays = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const normalized = date.toDateString();
      const sessionsForDay = upcomingSessions.filter((session) => {
        if (!session.startAt) {
          return false;
        }
        const sessionDate = new Date(session.startAt);
        return sessionDate.toDateString() === normalized;
      });

      return {
        date,
        sessions: sessionsForDay,
        isToday: index === 0,
      };
    });
  }, [upcomingSessions]);

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(
    (session: SessionItem) => session.status === "done" || session.status === "completed"
  ).length;
  const totalMinutes = sessions.reduce<number>((accumulator: number, session: SessionItem) => accumulator + (session.minutes ?? 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  const displayName = me?.name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  const isLoading = authLoading || (!!user && !me);

  const pageBody = isLoading ? (
    <section className="td-dashboard td-dashboard--loading">
      <div className="td-dashboard__loading-card">
        <span className="td-dashboard__loading-spinner" aria-hidden="true" />
        <p>Loading your dashboard…</p>
      </div>
    </section>
  ) : (
    <main className="td-dashboard" role="main">
      <div className="container">
        <section className="td-dashboard__intro">
          <div className="td-dashboard__intro-text">
            <span className="td-dashboard__eyebrow">Dashboard</span>
            <h1 className="td-dashboard__title">Welcome back, {displayName}.</h1>
            <p className="td-dashboard__subtitle">
              Anchor your learning swaps, keep an eye on what is coming next, and stay connected with the Swap community.
            </p>

            <div className="td-dashboard__chips">
              <span className="td-dashboard__chip" aria-label={`You have ${tokenBalance} available tokens`}>
                <span className="td-dashboard__chip-label">Tokens</span>
                <span className="td-dashboard__chip-value">{tokenBalance}</span>
              </span>
              <span className="td-dashboard__chip" aria-label={`${completedSessions} sessions completed`}>
                <span className="td-dashboard__chip-label">Completed</span>
                <span className="td-dashboard__chip-value">{completedSessions}</span>
              </span>
              <span className="td-dashboard__chip" aria-label={`${pendingRequests.length} requests waiting`}>
                <span className="td-dashboard__chip-label">Pending requests</span>
                <span className="td-dashboard__chip-value">{pendingRequests.length}</span>
              </span>
            </div>

            <div className="td-dashboard__intro-actions">
              <a className="td-dashboard__link td-btn td-btn-lg" href={swapAppRoutes.matches}>
                Explore matches
              </a>
              <a className="td-dashboard__link td-btn td-btn-outline td-btn-lg" href={swapAppRoutes.sessions}>
                View sessions
              </a>
            </div>
          </div>

          <div className="td-dashboard__next">
            <header className="td-dashboard__next-header">
              <h2>Next session</h2>
              <a className="td-dashboard__link td-dashboard__link--subtle" href={swapAppRoutes.sessions}>
                View all
              </a>
            </header>

            {nextSession ? (
              <div className="td-dashboard__next-card">
                <p className="td-dashboard__next-title">{nextSession.courseCode}</p>
                {nextSession.startAt ? (
                  <p className="td-dashboard__next-time">
                    {formatDateLabel(new Date(nextSession.startAt))} · {formatTimeLabel(new Date(nextSession.startAt))}
                  </p>
                ) : null}
                <p className="td-dashboard__next-meta">With {getSessionPartner(nextSession, me?.email)}</p>
                <div className="td-dashboard__next-foot">
                  <span className="td-dashboard__tag">{nextSession.minutes} min</span>
                  <a className="td-dashboard__link td-dashboard__link--ghost" href={swapAppRoutes.chat}>
                    Message partner
                  </a>
                </div>
              </div>
            ) : (
              <div className="td-dashboard__empty">
                <p>No upcoming sessions yet.</p>
                <a className="td-dashboard__link" href={swapAppRoutes.matches}>
                  Find a swap partner
                </a>
              </div>
            )}

            <ul className="td-dashboard__week" aria-label="Upcoming week">
              {calendarDays.map(({ date, sessions: daily, isToday }) => (
                <li
                  key={date.toISOString()}
                  className={`td-dashboard__week-item${daily.length ? " has-sessions" : ""}${isToday ? " is-today" : ""}`}
                >
                  <span className="td-dashboard__week-day">{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span className="td-dashboard__week-date">{date.getDate()}</span>
                  {daily.length > 0 ? <span className="td-dashboard__week-count">{daily.length}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="td-dashboard__metrics-section" aria-label="Learning highlights">
          <ul className="td-dashboard__metrics">
            <li className="td-dashboard__metric" aria-label={`${totalSessions} total sessions`}>
              <span className="td-dashboard__metric-label">Total sessions</span>
              <span className="td-dashboard__metric-value">{totalSessions}</span>
              <span className="td-dashboard__metric-footnote">Across all matches</span>
            </li>
            <li className="td-dashboard__metric" aria-label={`${totalHours} hours and ${remainingMinutes} minutes logged`}>
              <span className="td-dashboard__metric-label">Learning hours</span>
              <span className="td-dashboard__metric-value">
                {totalHours}
                <span className="td-dashboard__metric-unit">h</span>
                {remainingMinutes}
                <span className="td-dashboard__metric-unit">m</span>
              </span>
              <span className="td-dashboard__metric-footnote">Time shared on Swap</span>
            </li>
            <li className="td-dashboard__metric" aria-label={`${completedSessions} sessions completed`}>
              <span className="td-dashboard__metric-label">Completed</span>
              <span className="td-dashboard__metric-value">{completedSessions}</span>
              <span className="td-dashboard__metric-footnote">Ready for reflections</span>
            </li>
            <li className="td-dashboard__metric" aria-label={`${pendingRequests.length} pending requests`}>
              <span className="td-dashboard__metric-label">Pending requests</span>
              <span className="td-dashboard__metric-value">{pendingRequests.length}</span>
              <span className="td-dashboard__metric-footnote">Waiting for your response</span>
            </li>
          </ul>
        </section>

        <section className="td-dashboard__content">
          <div className="td-dashboard__column">
            <article className="td-dashboard__section" aria-labelledby="dashboard-weekly-flow">
              <header className="td-dashboard__section-header">
                <div>
                  <h2 id="dashboard-weekly-flow" className="td-dashboard__section-title">
                    Weekly flow
                  </h2>
                  <p className="td-dashboard__section-subtitle">Your upcoming commitments at a glance</p>
                </div>
                <a className="td-dashboard__link td-dashboard__link--subtle" href={swapAppRoutes.sessions}>
                  Open calendar
                </a>
              </header>

              {upcomingSessions.length === 0 ? (
                <div className="td-dashboard__empty">
                  <p>No scheduled sessions this week.</p>
                  <a className="td-dashboard__link" href={swapAppRoutes.matches}>
                    Discover new matches
                  </a>
                </div>
              ) : (
                <ul className="td-dashboard__timeline">
                  {upcomingSessions.slice(0, 5).map((session) => (
                    <li key={session.id} className="td-dashboard__timeline-item">
                      <span className="td-dashboard__timeline-dot" aria-hidden="true" />
                      <div className="td-dashboard__timeline-main">
                        <p className="td-dashboard__list-title">{session.courseCode}</p>
                        {session.startAt ? (
                          <p className="td-dashboard__timeline-meta">
                            {formatDateLabel(new Date(session.startAt))} · {formatTimeLabel(new Date(session.startAt))} · With {getSessionPartner(session, me?.email)}
                          </p>
                        ) : null}
                      </div>
                      <span className="td-dashboard__tag">{session.minutes} min</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="td-dashboard__section" aria-labelledby="dashboard-pending-requests">
              <header className="td-dashboard__section-header">
                <div>
                  <h2 id="dashboard-pending-requests" className="td-dashboard__section-title">
                    Pending requests
                  </h2>
                  <p className="td-dashboard__section-subtitle">Keep your matches moving</p>
                </div>
                <a className="td-dashboard__link td-dashboard__link--subtle" href={swapAppRoutes.requests}>
                  Manage
                </a>
              </header>

              {pendingRequests.length === 0 ? (
                <div className="td-dashboard__empty">
                  <p>No pending requests right now.</p>
                  <a className="td-dashboard__link" href={swapAppRoutes.community}>
                    Share availability in the community
                  </a>
                </div>
              ) : (
                <ul className="td-dashboard__list">
                  {pendingRequests.slice(0, 4).map((request: RequestItem) => (
                    <li key={request.id} className="td-dashboard__list-item">
                      <div className="td-dashboard__list-main">
                        <p className="td-dashboard__list-title">{request.courseCode}</p>
                        <p className="td-dashboard__list-subtitle">{request.minutes} minutes requested</p>
                      </div>
                      <span className="td-dashboard__tag td-dashboard__tag--pending">Pending</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </div>

          <div className="td-dashboard__column td-dashboard__column--secondary">
            <article className="td-dashboard__section" aria-labelledby="dashboard-latest-sessions">
              <header className="td-dashboard__section-header">
                <div>
                  <h2 id="dashboard-latest-sessions" className="td-dashboard__section-title">
                    Latest activity
                  </h2>
                  <p className="td-dashboard__section-subtitle">Recap your recent swaps</p>
                </div>
                <a className="td-dashboard__link td-dashboard__link--subtle" href={swapAppRoutes.sessions}>
                  View history
                </a>
              </header>

              {recentSessions.length === 0 ? (
                <div className="td-dashboard__empty">
                  <p>No session history yet. Start your first swap!</p>
                  <a className="td-dashboard__link" href={swapAppRoutes.matches}>
                    Browse courses
                  </a>
                </div>
              ) : (
                <ul className="td-dashboard__list">
                  {recentSessions.slice(0, 4).map((session) => (
                    <li key={session.id} className="td-dashboard__list-item">
                      <div className="td-dashboard__list-main">
                        <p className="td-dashboard__list-title">{session.courseCode}</p>
                        <p className="td-dashboard__list-subtitle">
                          {session.status === "scheduled" ? "Scheduled" : "Completed"}
                        </p>
                      </div>
                      <span className="td-dashboard__tag">{session.minutes} min</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="td-dashboard__cta-card" aria-label="Community call to action">
              <h3>Stay close to the community</h3>
              <p>
                Swap is better together. Share wins, ask questions, and line up your next exchange in the community chat.
              </p>
              <a className="td-dashboard__link td-btn td-btn-lg" href={swapAppRoutes.chat}>
                Open community chat
              </a>
              <a className="td-dashboard__link td-dashboard__link--ghost" href={swapAppRoutes.profile}>
                Update your profile
              </a>
            </article>
          </div>
        </section>
      </div>
    </main>
  );

  return (
    <>
      <DashboardNavigation />
      {pageBody}
    </>
  );
};

export default Dashboard;
