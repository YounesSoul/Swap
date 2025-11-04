import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import { ensureThread, listMessages, listThreads, sendMessage } from "@/lib/api";
import { useSwap, type SwapState } from "@/lib/store";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import "@/styles/chat.scss";

type ThreadSummary = {
  id: string;
  other: { email: string; name?: string | null };
};

type MessageEntry = { id: string; threadId: string; senderId: string; text: string; createdAt: string };

type ThreadParticipant = {
  id?: string;
  email?: string | null;
  name?: string | null;
};

type ThreadResponse = {
  id: string;
  participantA?: ThreadParticipant;
  participantB?: ThreadParticipant;
};

const initials = (input?: string | null) => {
  return (
    (input ?? "")
      .split(/[@\s.]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((token) => token.charAt(0).toUpperCase())
      .join("") || "SW"
  );
};

const normalizeEmail = (value?: string | null) => value?.toLowerCase() ?? "";

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useSupabaseAuth();
  const me = useSwap((state: SwapState) => state.me);
  const meEmail = user?.email ?? me?.email ?? "";

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const withEmailParam = searchParams.get("with");

  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [activeOtherEmail, setActiveOtherEmail] = useState<string | null>(null);
  const [myParticipantId, setMyParticipantId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [composer, setComposer] = useState("");

  const pollRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<string | undefined>(undefined);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/signin?callbackUrl=${encodeURIComponent("/chat")}`);
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    let cancelled = false;
    if (!meEmail) {
      setThreads([]);
      return;
    }

    const loadThreads = async () => {
      try {
        const result = (await listThreads(meEmail)) ?? [];
        if (!cancelled) {
          setThreads(result);
        }
      } catch (error) {
        console.error("Failed to load threads", error);
        if (!cancelled) {
          toast.error("Could not load your conversations.");
        }
      }
    };

    void loadThreads();
    return () => {
      cancelled = true;
    };
  }, [meEmail]);

  useEffect(() => {
    if (!meEmail || !withEmailParam) {
      return;
    }

    let cancelled = false;
    const attachThread = async () => {
      try {
        const thread = (await ensureThread(meEmail, withEmailParam)) as ThreadResponse;
        if (cancelled || !thread?.id) {
          return;
        }

        setActiveThreadId(thread.id);
        setActiveOtherEmail(withEmailParam);
        const myParticipant =
          normalizeEmail(thread.participantA?.email) === normalizeEmail(meEmail)
            ? thread.participantA
            : thread.participantB;
        setMyParticipantId(myParticipant?.id ?? null);

        setThreads((existing) => {
          const exists = existing.some((entry) => entry.id === thread.id);
          if (exists) {
            return existing;
          }
          const otherParticipant =
            normalizeEmail(thread.participantA?.email) === normalizeEmail(meEmail)
              ? thread.participantB
              : thread.participantA;
          return [
            {
              id: thread.id,
              other: {
                email: otherParticipant?.email ?? withEmailParam,
                name: otherParticipant?.name ?? withEmailParam,
              },
            },
            ...existing,
          ];
        });
      } catch (error) {
        console.error("Failed to ensure thread", error);
        toast.error("Could not open this conversation.");
      }
    };

    void attachThread();
    return () => {
      cancelled = true;
    };
  }, [meEmail, withEmailParam]);

  useEffect(() => {
    if (!activeThreadId || !meEmail) {
      return;
    }

    let cancelled = false;
    const hydrateMessages = async () => {
      try {
        const initial = (await listMessages(activeThreadId)) ?? [];
        if (cancelled) {
          return;
        }
        setMessages(initial);
        lastTimestampRef.current = initial.length ? initial[initial.length - 1].createdAt : undefined;
        requestAnimationFrame(() => {
          scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight });
        });
      } catch (error) {
        console.error("Failed to load messages", error);
        if (!cancelled) {
          toast.error("Could not load messages.");
        }
      }
    };

    void hydrateMessages();

    if (pollRef.current) {
      window.clearInterval(pollRef.current);
    }

    pollRef.current = window.setInterval(async () => {
      const after = lastTimestampRef.current;
      try {
        const newer = (await listMessages(activeThreadId, after)) ?? [];
        if (!newer.length) {
          return;
        }
        setMessages((prev) => [...prev, ...newer]);
        lastTimestampRef.current = newer[newer.length - 1].createdAt;
        requestAnimationFrame(() => {
          scrollContainerRef.current?.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        });
      } catch (error) {
        console.error("Failed to fetch new messages", error);
      }
    }, 2500);

    return () => {
      if (pollRef.current) {
        window.clearInterval(pollRef.current);
        pollRef.current = null;
      }
      cancelled = true;
    };
  }, [activeThreadId, meEmail]);

  useEffect(() => {
    if (!activeThreadId && threads.length > 0) {
      void openThread(threads[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threads]);

  const openThread = async (thread: ThreadSummary) => {
    if (!meEmail) {
      return;
    }

    try {
      const ensured = (await ensureThread(meEmail, thread.other.email)) as ThreadResponse;
      setActiveThreadId(ensured.id);
      setActiveOtherEmail(thread.other.email);
      const myParticipant =
        normalizeEmail(ensured.participantA?.email) === normalizeEmail(meEmail)
          ? ensured.participantA
          : ensured.participantB;
      setMyParticipantId(myParticipant?.id ?? null);
    } catch (error) {
      console.error("Failed to open thread", error);
      toast.error("Could not open this conversation.");
    }
  };

  const handleSend = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeThreadId || !meEmail) {
      return;
    }

    const text = composer.trim();
    if (!text) {
      return;
    }

    setComposer("");
    try {
      const message = await sendMessage(activeThreadId, meEmail, text);
      if (!message) {
        toast.error("Message not sent. Try again.");
        return;
      }

      setMessages((prev) => [...prev, message]);
      lastTimestampRef.current = message.createdAt;
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Could not send your message.");
    }
  };

  const activeOtherDisplay = useMemo(() => {
    if (!activeThreadId) {
      return "Swap chat";
    }
    const thread = threads.find((entry) => entry.id === activeThreadId);
    return thread?.other?.name ?? activeOtherEmail ?? "Swap chat";
  }, [activeThreadId, threads, activeOtherEmail]);

  const activeMessages = messages;

  const pageBody = authLoading ? (
    <section className="td-chat td-chat--loading">
      <div className="td-chat__loading-card">
        <span className="td-chat__loader" aria-hidden="true" />
        <p>Loading your conversations…</p>
      </div>
    </section>
  ) : (
    <main className="td-chat" role="main">
      <div className="container">
        <section className="td-chat__intro">
          <span className="td-chat__badge">Community chat</span>
          <h1 className="td-chat__title">Stay in touch with your swap partners</h1>
          <p className="td-chat__text">
            Keep every conversation flowing, coordinate next sessions, and celebrate progress together.
          </p>
        </section>

        <section className="td-chat__layout">
          <aside className="td-chat__sidebar" aria-label="Conversations">
            <header className="td-chat__sidebar-head">
              <h2>Conversations</h2>
            </header>
            <div className="td-chat__thread-list">
              {threads.length === 0 ? (
                <div className="td-chat__empty">No conversations yet. Start by sending a request.</div>
              ) : (
                threads.map((thread) => {
                  const isActive = thread.id === activeThreadId;
                  const label = thread.other.name || thread.other.email;
                  return (
                    <button
                      key={thread.id}
                      type="button"
                      className={`td-chat__thread${isActive ? " is-active" : ""}`}
                      onClick={() => void openThread(thread)}
                    >
                      <div className="td-chat__thread-avatar" aria-hidden="true">
                        {initials(label)}
                      </div>
                      <div>
                        <p className="td-chat__thread-name">{label}</p>
                        <p className="td-chat__thread-email">{thread.other.email}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="td-chat__panel" aria-label="Messages">
            <header className="td-chat__panel-head">
              <div className="td-chat__panel-avatar" aria-hidden="true">
                {initials(activeOtherDisplay)}
              </div>
              <div>
                <h2>{activeOtherDisplay}</h2>
                {activeOtherEmail ? <p>{activeOtherEmail}</p> : null}
              </div>
            </header>

            <div ref={scrollContainerRef} className="td-chat__messages" role="log" aria-live="polite">
              {(!activeThreadId || activeMessages.length === 0) && (
                <div className="td-chat__messages-empty">No messages yet. Say hello 👋</div>
              )}

              <div className="td-chat__bubbles">
                {activeMessages.map((message) => {
                  const mine = !!myParticipantId && message.senderId === myParticipantId;
                  const timestamp = new Date(message.createdAt);
                  const timeLabel = timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                  return (
                    <div key={message.id} className={`td-chat__bubble-row${mine ? " is-mine" : ""}`}>
                      <div className={`td-chat__bubble${mine ? " td-chat__bubble--mine" : " td-chat__bubble--theirs"}`}>
                        <p>{message.text}</p>
                        <time dateTime={message.createdAt}>{timeLabel}</time>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <form className="td-chat__composer" onSubmit={handleSend}>
              <label className="td-chat__sr" htmlFor="chat-composer">
                Type a message
              </label>
              <input
                id="chat-composer"
                type="text"
                placeholder="Type a message…"
                value={composer}
                onChange={(event) => setComposer(event.currentTarget.value)}
                autoComplete="off"
              />
              <button type="submit" className="td-btn td-btn-lg" disabled={!activeThreadId}>
                Send
              </button>
            </form>
          </section>
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

export default Chat;
