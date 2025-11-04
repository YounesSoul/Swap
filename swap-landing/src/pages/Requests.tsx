import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock, Inbox, MessageSquare, Send, User, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import { swapAppRoutes } from "@/config/appRoutes";
import { useSwap, type RequestItem, type SwapState } from "@/lib/store";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import "@/styles/requests.scss";

type Filter = "all" | "pending" | "accepted" | "declined";
type RequestRecord = RequestItem & Record<string, any>;

type RequestCardProps = {
  request: RequestRecord;
  type: "inbox" | "sent";
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  processingId?: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

const normalizeStatus = (status?: string | null) => status?.toUpperCase?.() ?? "PENDING";

const resolvePartnerLabel = (request: RequestRecord, type: "inbox" | "sent") => {
  const key = type === "inbox" ? "from" : "to";
  const user = request[`${key}User`];
  const legacyName = request[`${key}Name`];
  const legacyEmail = request[`${key}Email`];

  if (user?.name) return user.name;
  if (legacyName) return legacyName;
  if (user?.email) return user.email;
  if (legacyEmail) return legacyEmail;
  if (type === "inbox" && request.fromUserId) return "Swap member";
  if (type === "sent" && request.toUserId) return "Swap member";
  return "Unknown";
};

const resolvePartnerEmail = (request: RequestRecord, type: "inbox" | "sent") => {
  const key = type === "inbox" ? "from" : "to";
  const user = request[`${key}User`];
  const legacyEmail = request[`${key}Email`];
  if (user?.email) return user.email;
  if (legacyEmail) return legacyEmail;
  return undefined;
};

const RequestCard = ({ request, type, onAccept, onDecline, processingId }: RequestCardProps) => {
  const status = normalizeStatus(request.status);
  const subject = request.courseCode || request.skill || request.skills?.[0]?.name || "Swap session";
  const partnerName = resolvePartnerLabel(request, type);
  const partnerEmail = resolvePartnerEmail(request, type);
  const createdAt = request.createdAt ? new Date(request.createdAt) : undefined;
  const minutesLabel = `${request.minutes ?? 60} minutes`;
  const defaultNote = request.note?.includes("Can we do a 1h session?");
  const shouldDisplayNote = !!request.note && !defaultNote;
  const isPending = status === "PENDING";
  const isProcessing = processingId === request.id;

  return (
    <article className="td-requests__card" data-status={status.toLowerCase()}>
      <header className="td-requests__card-head">
        <div className="td-requests__subject">
          <div className="td-requests__subject-icon" aria-hidden="true">
            {type === "inbox" ? <Inbox size={18} /> : <Send size={18} />}
          </div>
          <div>
            <h3>{subject}</h3>
            <p>
              <User size={14} aria-hidden="true" />
              <span>
                {type === "inbox" ? "From" : "To"} {partnerName}
                {partnerEmail ? ` · ${partnerEmail}` : ""}
              </span>
            </p>
          </div>
        </div>
        <span className={`td-requests__status td-requests__status--${status.toLowerCase()}`}>
          {STATUS_LABELS[status] ?? status}
        </span>
      </header>

      <dl className="td-requests__details">
        <div>
          <dt>Duration</dt>
          <dd>
            <Clock size={14} aria-hidden="true" />
            <span>{minutesLabel}</span>
          </dd>
        </div>
        {createdAt ? (
          <div>
            <dt>Requested</dt>
            <dd>{createdAt.toLocaleDateString()}</dd>
          </div>
        ) : null}
      </dl>

      {shouldDisplayNote ? (
        <div className="td-requests__note">
          <MessageSquare size={16} aria-hidden="true" />
          <p>{request.note}</p>
        </div>
      ) : null}

      {Array.isArray(request.skills) && request.skills.length > 0 ? (
        <ul className="td-requests__chips">
          {request.skills.slice(0, 4).map((skill: { name: string }) => (
            <li key={skill.name}>{skill.name}</li>
          ))}
          {request.skills.length > 4 ? <li>+{request.skills.length - 4} more</li> : null}
        </ul>
      ) : null}

      {type === "inbox" && isPending ? (
        <div className="td-requests__actions">
          <button
            type="button"
            className="td-btn td-btn-lg td-requests__accept"
            onClick={() => onAccept?.(request.id)}
            disabled={isProcessing}
          >
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>{isProcessing ? "Processing…" : "Accept"}</span>
          </button>
          <button
            type="button"
            className="td-btn td-btn-outline td-requests__decline"
            onClick={() => onDecline?.(request.id)}
            disabled={isProcessing}
          >
            <XCircle size={16} aria-hidden="true" />
            <span>{isProcessing ? "Hold on…" : "Decline"}</span>
          </button>
        </div>
      ) : null}
    </article>
  );
};

const Requests = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSupabaseAuth();
  const me = useSwap((state: SwapState) => state.me);
  const inbox = useSwap((state: SwapState) => state.inbox) as RequestRecord[];
  const sent = useSwap((state: SwapState) => state.sent) as RequestRecord[];
  const acceptRequest = useSwap((state: SwapState) => state.acceptRequest);
  const declineRequest = useSwap((state: SwapState) => state.declineRequest);
  const clearAnsweredRequests = useSwap((state: SwapState) => state.clearAnsweredRequests);
  const clearAllRequests = useSwap((state: SwapState) => state.clearAllRequests);

  const [filter, setFilter] = useState<Filter>("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [clearing, setClearing] = useState<"answered" | "all" | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/signin?callbackUrl=${encodeURIComponent("/requests")}`);
    }
  }, [authLoading, navigate, user]);

  const isLoadingPage = authLoading || (!!user && !me);

  const stats = useMemo(() => {
    const collection = [...inbox, ...sent];
    const byStatus = (status: string) => collection.filter((item) => normalizeStatus(item.status) === status).length;

    return {
      inboxCount: inbox.length,
      sentCount: sent.length,
      pendingCount: byStatus("PENDING"),
      acceptedCount: byStatus("ACCEPTED"),
      declinedCount: byStatus("DECLINED"),
      totalCount: collection.length,
    };
  }, [inbox, sent]);

  const filterRequests = (requests: RequestRecord[]) => {
    if (filter === "all") return requests;
    return requests.filter((item) => normalizeStatus(item.status) === filter.toUpperCase());
  };

  const filteredInbox = useMemo(() => filterRequests(inbox), [filter, inbox]);
  const filteredSent = useMemo(() => filterRequests(sent), [filter, sent]);

  const handleAccept = async (id: string) => {
    setProcessingId(id);
    try {
      await acceptRequest(id);
      toast.success("Request accepted");
    } catch (error) {
      console.error("Failed to accept request", error);
      toast.error("Could not accept the request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (id: string) => {
    setProcessingId(id);
    try {
      await declineRequest(id);
      toast.success("Request declined");
    } catch (error) {
      console.error("Failed to decline request", error);
      toast.error("Could not decline the request.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleClearAnswered = async () => {
    setClearing("answered");
    try {
      await clearAnsweredRequests();
      toast.success("Cleared answered requests");
    } catch (error) {
      console.error("Failed to clear answered requests", error);
      toast.error("Could not clear requests.");
    } finally {
      setClearing(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to remove every request? This cannot be undone.")) {
      return;
    }

    setClearing("all");
    try {
      await clearAllRequests();
      toast.success("Cleared all requests");
    } catch (error) {
      console.error("Failed to clear all requests", error);
      toast.error("Could not clear requests.");
    } finally {
      setClearing(null);
    }
  };

  const suggestionFilters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "accepted", label: "Accepted" },
    { key: "declined", label: "Declined" },
  ];

  const pageBody = isLoadingPage ? (
    <section className="td-requests td-requests--loading">
      <div className="td-requests__loading-card">
        <span className="td-requests__loader" aria-hidden="true" />
        <p>Loading your requests…</p>
      </div>
    </section>
  ) : (
    <main className="td-requests" role="main">
      <div className="container">
        <section className="td-requests__intro">
          <span className="td-requests__badge">Requests</span>
          <h1 className="td-requests__title">Keep every swap on track</h1>
          <p className="td-requests__text">
            Review new invitations, respond to pending matches, and stay close to the conversations that matter.
          </p>
          <div className="td-requests__highlight">
            <AlertCircle size={18} aria-hidden="true" />
            <p>
              Need a new partner? <a href={swapAppRoutes.matches}>Browse the matches page</a> to send a fresh request.
            </p>
          </div>
        </section>

        <section className="td-requests__stats" aria-label="Request snapshot">
          <article className="td-requests__stat-card">
            <div className="td-requests__stat-icon td-requests__stat-icon--primary" aria-hidden="true">
              <Inbox size={20} />
            </div>
            <div>
              <p>Total inbox</p>
              <strong>{stats.inboxCount}</strong>
            </div>
          </article>
          <article className="td-requests__stat-card">
            <div className="td-requests__stat-icon td-requests__stat-icon--violet" aria-hidden="true">
              <Send size={20} />
            </div>
            <div>
              <p>Total sent</p>
              <strong>{stats.sentCount}</strong>
            </div>
          </article>
          <article className="td-requests__stat-card">
            <div className="td-requests__stat-icon td-requests__stat-icon--amber" aria-hidden="true">
              <Clock size={20} />
            </div>
            <div>
              <p>Pending</p>
              <strong>{stats.pendingCount}</strong>
            </div>
          </article>
          <article className="td-requests__stat-card">
            <div className="td-requests__stat-icon td-requests__stat-icon--emerald" aria-hidden="true">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p>Accepted</p>
              <strong>{stats.acceptedCount}</strong>
            </div>
          </article>
        </section>

        <section className="td-requests__filters" aria-label="Filter requests">
          <div className="td-requests__filter-pills">
            {suggestionFilters.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`td-requests__filter${filter === key ? " is-active" : ""}`}
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="td-requests__actions-row">
            <button
              type="button"
              className="td-btn td-btn-outline td-requests__clear"
              onClick={handleClearAnswered}
              disabled={clearing === "answered"}
            >
              {clearing === "answered" ? "Clearing…" : "Clear answered"}
            </button>
          </div>
        </section>

        <section className="td-requests__grid">
          <div className="td-requests__column">
            <header className="td-requests__panel-head">
              <h2>Inbox</h2>
              <span>{filteredInbox.length}</span>
            </header>
            {filteredInbox.length === 0 ? (
              <div className="td-requests__empty">
                <span role="img" aria-label="Empty inbox">📬</span>
                <p>No incoming requests found.</p>
              </div>
            ) : (
              <div className="td-requests__list">
                {filteredInbox.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    type="inbox"
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    processingId={processingId}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="td-requests__column">
            <header className="td-requests__panel-head">
              <h2>Sent</h2>
              <span>{filteredSent.length}</span>
            </header>
            {filteredSent.length === 0 ? (
              <div className="td-requests__empty">
                <span role="img" aria-label="Empty sent">📤</span>
                <p>No sent requests yet.</p>
              </div>
            ) : (
              <div className="td-requests__list">
                {filteredSent.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    type="sent"
                    processingId={processingId}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="td-requests__advanced">
          <details>
            <summary>
              <span role="img" aria-label="Settings">⚙️</span>
              Advanced actions
            </summary>
            <div className="td-requests__advanced-body">
              <p>Use with caution — these actions permanently remove requests.</p>
              <button
                type="button"
                className="td-btn td-btn-outline td-requests__danger"
                onClick={handleClearAll}
                disabled={clearing === "all"}
              >
                {clearing === "all" ? "Clearing…" : "Clear all requests"}
              </button>
            </div>
          </details>
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

export default Requests;
