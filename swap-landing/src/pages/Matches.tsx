import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import { swapAppRoutes } from "@/config/appRoutes";
import { getApiBase } from "@/lib/api";
import { useSwap, type SwapState, type TeacherResult } from "@/lib/store";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import "@/styles/matches.scss";

type SearchMode = "skill" | "course";

type TimeSlot = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  sessionType?: "ONLINE" | "FACE_TO_FACE";
};

type SearchTeacherResult = TeacherResult & { timeSlots?: TimeSlot[] };

const dayOrder: Record<string, number> = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
};

const formatDayLabel = (day?: string) => {
  if (!day) return "";
  return day.charAt(0) + day.slice(1).toLowerCase();
};

type ResultCardProps = {
  result: SearchTeacherResult;
  meEmail?: string | null;
  onMessage: () => void;
  onBook: (label: string) => void;
  onBookTimeSlot: (slot: TimeSlot, label: string) => void;
  isBooking: boolean;
};

const ResultCard = ({ result, meEmail, onMessage, onBook, onBookTimeSlot, isBooking }: ResultCardProps) => {
  const primaryLabel = result.course?.code ?? result.skills?.[0]?.name ?? "";
  const normalizedLabel = (primaryLabel ?? "").toString();
  const isMe = result.user.email?.toLowerCase() === meEmail?.toLowerCase();
  const ratingValue = result.ratingData?.averageRating ?? 0;
  const ratingCount = result.ratingData?.totalRatings ?? 0;
  const displayRating = ratingValue > 0 ? ratingValue.toFixed(1) : "—";
  const hasAvailability = (result.timeSlots?.length ?? 0) > 0;

  const sortedSlots = useMemo(() => {
    const source = result.timeSlots ?? [];
    return [...source].sort((a, b) => {
      const dayDifference = (dayOrder[a.dayOfWeek] ?? 0) - (dayOrder[b.dayOfWeek] ?? 0);
      if (dayDifference !== 0) {
        return dayDifference;
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [result.timeSlots]);

  return (
    <article className="td-matches__card">
      <header className="td-matches__card-header">
        <div className="td-matches__identity">
          <div className="td-matches__avatar" aria-hidden="true">
            {(result.user.name ?? result.user.email ?? "?").charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="td-matches__name">{result.user.name ?? "Swap member"}</h3>
            <p className="td-matches__meta">{result.user.email}</p>
          </div>
        </div>
        <div className="td-matches__rating" aria-label={`Average rating ${displayRating} from ${ratingCount} ratings`}>
          <span className="td-matches__rating-value">{displayRating}</span>
          <span className="td-matches__rating-count">{ratingCount > 0 ? `${ratingCount} ratings` : "New"}</span>
        </div>
      </header>

      {result.skills && result.skills.length > 0 ? (
        <div className="td-matches__section">
          <p className="td-matches__section-label">Skills</p>
          <ul className="td-matches__chips">
            {result.skills.map((skill, index) => (
              <li key={`${skill.name}-${index}`} className="td-matches__chip">
                {skill.name} · {skill.level.toLowerCase()}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.course ? (
        <div className="td-matches__section td-matches__course">
          <p className="td-matches__section-label">Course excellence</p>
          <div className="td-matches__course-badge">
            <span className="td-matches__course-code">{result.course.code}</span>
            {result.course.grade ? <span className="td-matches__course-grade">Grade {result.course.grade}</span> : null}
          </div>
        </div>
      ) : null}

      {hasAvailability ? (
        <div className="td-matches__section">
          <p className="td-matches__section-label">Available time slots</p>
          <div className="td-matches__timeslots" role="list">
            {sortedSlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                className="td-matches__timeslot-button"
                onClick={() => onBookTimeSlot(slot, normalizedLabel)}
                disabled={isMe || isBooking || !normalizedLabel}
              >
                <span>{formatDayLabel(slot.dayOfWeek)}</span>
                <span>
                  {slot.startTime} – {slot.endTime}
                </span>
                <span className="td-matches__session-type">
                  {slot.sessionType === "ONLINE" ? "🌐 Online" : "📍 Face-to-face"}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="td-matches__muted">This member has not published availability yet.</p>
      )}

      <div className="td-matches__actions">
        <button
          type="button"
          className="td-btn td-btn-outline td-matches__message"
          onClick={onMessage}
          disabled={isMe}
        >
          {isMe ? "This is you" : "Message"}
        </button>
        <button
          type="button"
          className="td-btn td-btn-lg td-matches__cta"
          onClick={() => onBook(normalizedLabel)}
          disabled={isMe || isBooking || !normalizedLabel}
        >
          {isBooking ? "Sending…" : "Send request"}
        </button>
      </div>
    </article>
  );
};

const Matches = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSupabaseAuth();
  const me = useSwap((state: SwapState) => state.me);
  const interests = useSwap((state: SwapState) => state.myInterests);
  const rawResults = useSwap((state: SwapState) => state.searchResults);
  const searchTeachers = useSwap((state: SwapState) => state.searchTeachers);
  const sendRequest = useSwap((state: SwapState) => state.sendRequest);
  const onboarded = useSwap((state: SwapState) => state.onboarded);
  const isSeeded = useSwap((state: SwapState) => state.isSeeded);

  const results = useMemo(() => rawResults as SearchTeacherResult[], [rawResults]);

  const [mode, setMode] = useState<SearchMode>("skill");
  const [query, setQuery] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [lastMode, setLastMode] = useState<SearchMode>("skill");
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingEmail, setBookingEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/signin?callbackUrl=${encodeURIComponent("/matches")}`);
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (!authLoading && user && isSeeded && !onboarded) {
      navigate("/onboarding", { replace: true });
    }
  }, [authLoading, user, isSeeded, onboarded, navigate]);

  const performSearch = async (targetQuery: string, targetMode: SearchMode) => {
    const trimmed = targetQuery.trim();
    if (!trimmed) {
      return;
    }

    const normalizedInput = targetMode === "course" ? trimmed.toUpperCase() : trimmed;
    setQuery(normalizedInput);
    setLoading(true);
    setHasSearched(true);
    setLastQuery(normalizedInput);
    setLastMode(targetMode);

    try {
      if (targetMode === "course") {
        await searchTeachers({ course: normalizedInput });
      } else {
        await searchTeachers({ skill: normalizedInput });
      }
    } catch (error) {
      console.error("Failed to search teachers", error);
      toast.error("We could not search the community. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void performSearch(query, mode);
  };

  const handleInterestClick = (interest: SwapState["myInterests"][number]) => {
    setMode(interest.type);
    setQuery(interest.name);
    void performSearch(interest.name, interest.type);
  };

  const handleBook = async (email: string, label: string) => {
    if (!label) {
      toast.error("Select a course or skill before sending a request.");
      return;
    }

    setBookingEmail(email);

    try {
      const result = await sendRequest(email, label, 60, "Can we do a 1h session?");
      if (result?.ok) {
        toast.success("Request sent! Redirecting to requests.");
        window.location.href = swapAppRoutes.requests;
      } else {
        toast.error(result?.error ?? "Could not send request.");
      }
    } catch (error) {
      console.error("Failed to send swap request", error);
      toast.error("Could not send request. Please try again.");
    } finally {
      setBookingEmail(null);
    }
  };

  const handleBookTimeSlot = async (email: string, slot: TimeSlot, label: string) => {
    if (!me?.email) {
      toast.error("Please sign in to book a session.");
      return;
    }

    setBookingEmail(email);
    const apiBase = getApiBase();

    if (!apiBase) {
      toast.error("Booking is unavailable right now. Please try again soon.");
      setBookingEmail(null);
      return;
    }

    try {
      const response = await fetch(`${apiBase}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromEmail: me.email,
          toEmail: email,
          courseCode: label,
          minutes: 60,
          note: `Booking for ${formatDayLabel(slot.dayOfWeek)} ${slot.startTime}-${slot.endTime}`,
          timeSlotId: slot.id,
        }),
      });

      if (response.ok) {
        toast.success("Request sent! Redirecting to requests.");
        window.location.href = swapAppRoutes.requests;
      } else {
        const data = await response.json().catch(() => null);
        const message = data?.message ?? "Failed to send request.";
        toast.error(message);
      }
    } catch (error) {
      console.error("Failed to book time slot", error);
      toast.error("Could not send request. Please try again.");
    } finally {
      setBookingEmail(null);
    }
  };

  const handleMessage = (email: string) => {
    const url = `${swapAppRoutes.chat}?with=${encodeURIComponent(email)}`;
    window.location.href = url;
  };

  const isLoadingPage = authLoading || (!!user && !me);
  const hasResults = results.length > 0;
  const suggestionMode = mode;
  const suggestions = suggestionMode === "course"
    ? ["MATH305", "CS101", "CHEM120", "ECON212", "ENG201"]
    : ["Python", "Linear Algebra", "Adobe XD", "Guitar", "Chess"];
  const disableSearch = loading || query.trim().length === 0;

  const pageBody = isLoadingPage ? (
    <section className="td-matches td-matches--loading" role="status" aria-live="polite">
      <div className="td-matches__loading-card">
        <span className="td-matches__loader" aria-hidden="true" />
        <p>Loading your matches…</p>
      </div>
    </section>
  ) : (
    <main className="td-matches" role="main">
      <div className="container">
        <section className="td-matches__intro">
          <span className="td-matches__badge">Find a swap</span>
          <h1 className="td-matches__title">Discover your next learning partner</h1>
          <p className="td-matches__text">
            Search by skill or course code to match with peers who are ready to exchange knowledge and grow together.
          </p>
          <dl className="td-matches__stats" aria-label="Swap community pulse">
            <div className="td-matches__stat">
              <dt>Active teachers</dt>
              <dd>500+</dd>
            </div>
            <div className="td-matches__stat">
              <dt>Sessions completed</dt>
              <dd>1,200+</dd>
            </div>
            <div className="td-matches__stat">
              <dt>Average rating</dt>
              <dd>4.9★</dd>
            </div>
          </dl>
        </section>

        {interests.length > 0 ? (
          <section className="td-matches__interests" aria-label="Your learning interests">
            <header className="td-matches__section-head">
              <h2 className="td-matches__section-title">Your learning interests</h2>
              <p className="td-matches__section-text">Tap an interest to instantly search the community.</p>
            </header>
            <div className="td-matches__interest-chips">
              {interests.map((interest, index) => (
                <button
                  key={`${interest.name}-${index}`}
                  type="button"
                  className={`td-matches__interest-chip td-matches__interest-chip--${interest.type}`}
                  onClick={() => handleInterestClick(interest)}
                >
                  {interest.name}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="td-matches__search" aria-label="Search for matches">
          <div className="td-matches__mode-toggle" role="tablist" aria-label="Search mode">
            <button
              type="button"
              className={`td-matches__mode-button${mode === "skill" ? " is-active" : ""}`}
              onClick={() => setMode("skill")}
              aria-pressed={mode === "skill"}
            >
              Skills
            </button>
            <button
              type="button"
              className={`td-matches__mode-button${mode === "course" ? " is-active" : ""}`}
              onClick={() => setMode("course")}
              aria-pressed={mode === "course"}
            >
              Courses
            </button>
          </div>
          <form className="td-matches__form" onSubmit={handleSearchSubmit} role="search">
            <label className="td-matches__sr" htmlFor="matches-search">
              Search for a skill or course
            </label>
            <input
              id="matches-search"
              className="td-matches__input"
              type="search"
              placeholder={mode === "skill" ? "Search skills like Python, design, or guitar" : "Search course codes like CS101"}
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              autoComplete="off"
            />
            <button
              type="submit"
              className="td-btn td-btn-lg td-matches__submit"
              disabled={disableSearch}
            >
              {loading ? "Searching…" : "Search"}
            </button>
          </form>
        </section>

        <section className="td-matches__results" aria-live="polite">
          {loading ? (
            <div className="td-matches__loading" role="status">
              <span className="td-matches__loader" aria-hidden="true" />
              <p>Searching the Swap community…</p>
            </div>
          ) : hasResults ? (
            <>
              <header className="td-matches__results-head">
                <h2 className="td-matches__results-title">
                  Found {results.length} {lastMode === "skill" ? "teacher" : "student"}
                  {results.length !== 1 ? "s" : ""}
                </h2>
                <p className="td-matches__results-hint">
                  Searching for <span className="td-matches__query">“{lastQuery}”</span>
                </p>
              </header>
              <div className="td-matches__grid">
                {results.map((result) => (
                  <ResultCard
                    key={result.user.email}
                    result={result}
                    meEmail={me?.email}
                    onMessage={() => handleMessage(result.user.email)}
                    onBook={(label) => handleBook(result.user.email, label)}
                    onBookTimeSlot={(slot, label) => handleBookTimeSlot(result.user.email, slot, label)}
                    isBooking={bookingEmail === result.user.email}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="td-matches__empty">
              <div className="td-matches__empty-body">
                <h3>{hasSearched ? "No matches yet" : "Start your search"}</h3>
                <p>
                  {hasSearched
                    ? "Try adjusting your query or explore a suggestion below."
                    : "Search for a skill you want to learn or a course code you’ve completed."}
                </p>
              </div>
              <div className="td-matches__suggestions">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="td-matches__suggestion"
                    onClick={() => {
                      setMode(suggestionMode);
                      void performSearch(suggestion, suggestionMode);
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
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

export default Matches;
