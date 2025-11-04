import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Calendar, Star, User } from "lucide-react";
import { toast } from "react-toastify";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import { getUserRatings, getUserRatingStats } from "@/lib/api";
import { useSwap, type SwapState } from "@/lib/store";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import "@/styles/ratings.scss";

type Filter = "all" | "skill" | "course";

type RatingEntry = {
  id: string;
  rating: number;
  review?: string | null;
  category: "skill" | "course";
  skillOrCourse: string;
  createdAt: string;
  rater?: {
    id?: string;
    name?: string | null;
    email: string;
  } | null;
  session?: {
    id: string;
    courseCode?: string | null;
    createdAt?: string | null;
  } | null;
};

type RatingStats = {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
};

const defaultStats: RatingStats = {
  averageRating: 0,
  totalRatings: 0,
  ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};

const renderStars = (value: number) => {
  const rounded = Math.round(value);
  return (
    <div className="td-ratings__stars" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} size={16} aria-hidden="true" className={star <= rounded ? "is-active" : ""} />
      ))}
    </div>
  );
};

const Ratings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSupabaseAuth();
  const me = useSwap((state: SwapState) => state.me);
  const isSeeded = useSwap((state: SwapState) => state.isSeeded);
  const [searchParams] = useSearchParams();

  const rawUserId = searchParams.get("userId");
  const resolvedUserId = useMemo(() => {
    if (rawUserId && rawUserId !== "me") {
      return rawUserId;
    }
    return me?.id ?? null;
  }, [me?.id, rawUserId]);

  const viewingSelf = !!resolvedUserId && !!me?.id && resolvedUserId === me.id;

  const [filter, setFilter] = useState<Filter>("all");
  const [ratings, setRatings] = useState<RatingEntry[]>([]);
  const [stats, setStats] = useState<RatingStats>(defaultStats);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/signin?callbackUrl=${encodeURIComponent("/ratings")}`);
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (!resolvedUserId) {
      setRatings([]);
      setStats(defaultStats);
      return;
    }

    let cancelled = false;
    const category = filter === "all" ? undefined : filter;

    const load = async () => {
      setFetching(true);
      try {
        const [ratingsResponse, statsResponse] = await Promise.all([
          getUserRatings(resolvedUserId, category),
          getUserRatingStats(resolvedUserId, category),
        ]);

        if (cancelled) {
          return;
        }

        const nextRatings = Array.isArray(ratingsResponse?.data)
          ? (ratingsResponse.data as RatingEntry[])
          : [];
        setRatings(nextRatings);

        if (statsResponse?.data) {
          setStats(statsResponse.data as RatingStats);
        } else {
          setStats(defaultStats);
        }

        if (ratingsResponse && !ratingsResponse.success && !nextRatings.length) {
          toast.error("Could not load ratings right now.");
        }
      } catch (error) {
        console.error("Failed to load ratings", error);
        if (!cancelled) {
          toast.error("Something went wrong while loading ratings.");
          setRatings([]);
          setStats(defaultStats);
        }
      } finally {
        if (!cancelled) {
          setFetching(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [filter, resolvedUserId]);

  const isBootstrapping = authLoading || (!!user && !isSeeded);
  const showLoading = isBootstrapping || (fetching && ratings.length === 0);
  const hasValidUserId = !!resolvedUserId;

  const title = viewingSelf ? "Your Ratings" : "Community Ratings";
  const subtitle = viewingSelf
    ? "Discover how your sessions are resonating across the community."
    : "Insights and feedback collected from recent learning sessions.";

  const filterTabs: Array<{ key: Filter; label: string }> = [
    { key: "all", label: "All ratings" },
    { key: "skill", label: "Skills" },
    { key: "course", label: "Courses" },
  ];

  const content = showLoading ? (
    <section className="td-ratings__loading" aria-live="polite">
      <div className="td-ratings__loading-card">
        <span className="td-ratings__loader" aria-hidden="true" />
        <p>Loading ratings…</p>
      </div>
    </section>
  ) : !hasValidUserId ? (
    <section className="td-ratings__empty">
      <div className="td-ratings__empty-card">
        <h2>Profile not loaded</h2>
        <p>We could not determine which swap member you want to review. Try refreshing or navigate from the sessions page.</p>
        <ul>
          <li>Refresh the page after signing in.</li>
          <li>Return to Sessions and open ratings from there.</li>
          <li>Share the ratings link that contains the teacher&apos;s id.</li>
        </ul>
      </div>
    </section>
  ) : (
    <section className="td-ratings__body">
      <header className="td-ratings__intro">
        <span className="td-ratings__badge">Feedback hub</span>
        <h1 className="td-ratings__title">{title}</h1>
        <p className="td-ratings__text">{subtitle}</p>
      </header>

      <div className="td-ratings__controls" role="tablist" aria-label="Filter ratings">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`td-ratings__tab${filter === tab.key ? " is-active" : ""}`}
            onClick={() => setFilter(tab.key)}
            role="tab"
            aria-selected={filter === tab.key}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section className="td-ratings__stats" aria-label="Rating overview">
        <article className="td-ratings__stat-card td-ratings__stat-card--primary">
          <h2>Average score</h2>
          <p className="td-ratings__stat-value">{stats.averageRating.toFixed(1)}</p>
          {renderStars(stats.averageRating)}
          <p className="td-ratings__stat-hint">Across {stats.totalRatings} {stats.totalRatings === 1 ? "rating" : "ratings"}</p>
        </article>

        <article className="td-ratings__stat-card">
          <h3>Distribution</h3>
          <ul>
            {[5, 4, 3, 2, 1].map((star) => {
              const total = stats.totalRatings;
              const count = stats.ratingDistribution[star as 1 | 2 | 3 | 4 | 5] ?? 0;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <li key={star}>
                  <span className="td-ratings__distribution-label">
                    <Star size={14} aria-hidden="true" />
                    {star}
                  </span>
                  <span className="td-ratings__distribution-meter" aria-hidden="true">
                    <span style={{ width: `${percent}%` }} />
                  </span>
                  <span className="td-ratings__distribution-count">{count}</span>
                </li>
              );
            })}
          </ul>
        </article>
      </section>

      <section className="td-ratings__list" aria-label="Ratings">
        {fetching && ratings.length === 0 ? (
          <div className="td-ratings__loading-inline" aria-live="polite">
            <span className="td-ratings__loader" aria-hidden="true" />
            <p>Updating…</p>
          </div>
        ) : ratings.length === 0 ? (
          <div className="td-ratings__empty-list">
            <div className="td-ratings__emoji" aria-hidden="true">
              ⭐
            </div>
            <h3>No ratings yet</h3>
            <p>Complete more sessions to gather feedback from your peers.</p>
          </div>
        ) : (
          ratings.map((entry) => {
            const timestamp = entry.createdAt ? new Date(entry.createdAt) : null;
            const formattedDate = timestamp ? timestamp.toLocaleDateString() : "";
            const formattedTime = timestamp
              ? timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "";
            const raterName = entry.rater?.name || entry.rater?.email || "Swap member";
            const avatarSeed = entry.rater?.email ?? entry.rater?.id ?? "swap";
            const courseLabel = entry.skillOrCourse;

            return (
              <article key={entry.id} className="td-ratings__card">
                <header className="td-ratings__card-head">
                  <div className="td-ratings__identity">
                    <div className="td-ratings__avatar" aria-hidden="true">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`}
                        alt={raterName}
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h3>{raterName}</h3>
                      <p>
                        <User size={14} aria-hidden="true" />
                        <span>
                          {entry.category === "skill" ? "Skill" : "Course"}: {courseLabel}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="td-ratings__score">
                    {renderStars(entry.rating)}
                    <time dateTime={entry.createdAt}>
                      <Calendar size={14} aria-hidden="true" />
                      <span>
                        {formattedDate}
                        {formattedTime ? ` · ${formattedTime}` : ""}
                      </span>
                    </time>
                  </div>
                </header>

                {entry.review ? (
                  <blockquote className="td-ratings__review">“{entry.review}”</blockquote>
                ) : null}
              </article>
            );
          })
        )}
      </section>
    </section>
  );

  return (
    <>
      <DashboardNavigation />
      <main className="td-ratings" role="main">
        <div className="container">{content}</div>
      </main>
    </>
  );
};

export default Ratings;
