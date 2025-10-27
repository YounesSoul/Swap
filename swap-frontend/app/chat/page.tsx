"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ensureThread, listThreads, listMessages, sendMessage } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

type Thread = { id: string; other: { email: string; name?: string | null } };
type Message = { id: string; threadId: string; senderId: string; text: string; createdAt: string };

// simple initials
const initials = (nameOrEmail?: string | null) =>
  (nameOrEmail || "")
    .split(/[@\s.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]!.toUpperCase())
    .join("") || "ST";

export default function ChatPage() {
  const { data: session } = useSession();
  const meEmail = session?.user?.email || "";
  const sp = useSearchParams();
  const withEmailParam = sp.get("with");

  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeOtherEmail, setActiveOtherEmail] = useState<string | null>(null);
  const [myUserId, setMyUserId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const lastTs = useRef<string | undefined>(undefined);
  const pollRef = useRef<any>();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load thread list
  useEffect(() => {
    if (!meEmail) return;
    listThreads(meEmail).then(setThreads);
  }, [meEmail]);

  // If opened with ?with=email → ensure/open thread and capture myUserId
  useEffect(() => {
    (async () => {
      if (!meEmail || !withEmailParam) return;
      const t = await ensureThread(meEmail, withEmailParam);
      setActiveId(t.id);
      setActiveOtherEmail(withEmailParam);
      // determine myUserId from participants
      const mine =
        t.participantA?.email?.toLowerCase() === meEmail.toLowerCase()
          ? t.participantA
          : t.participantB;
      setMyUserId(mine?.id ?? null);

      // add into left list if missing
      setThreads(prev =>
        prev.find(th => th.id === t.id)
          ? prev
          : [{ id: t.id, other: { email: withEmailParam, name: (t.participantA?.email === meEmail ? t.participantB?.name : t.participantA?.name) ?? withEmailParam } }, ...prev]
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meEmail, withEmailParam]);

  // When user clicks a thread in the list
  async function openThread(th: Thread) {
    if (!meEmail) return;
    // call ensureThread to get participants → compute myUserId
    const t = await ensureThread(meEmail, th.other.email);
    setActiveId(t.id);
    setActiveOtherEmail(th.other.email);
    const mine =
      t.participantA?.email?.toLowerCase() === meEmail.toLowerCase()
        ? t.participantA
        : t.participantB;
    setMyUserId(mine?.id ?? null);
  }

  // Load initial messages + start polling when an active thread is set
  useEffect(() => {
    if (!activeId) return;

    let stop = false;
    (async () => {
      const initial = await listMessages(activeId);
      if (stop) return;
      setMessages(initial);
      lastTs.current = initial.length ? initial[initial.length - 1].createdAt : undefined;
      // scroll to bottom after initial load
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 0);
    })();

    clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const after = lastTs.current;
      const newer = await listMessages(activeId, after);
      if (newer?.length) {
        setMessages(prev => [...prev, ...newer]);
        lastTs.current = newer[newer.length - 1].createdAt;
        // auto-scroll when new messages arrive
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 0);
      }
    }, 2000);

    return () => {
      clearInterval(pollRef.current);
      stop = true;
    };
  }, [activeId]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId || !meEmail || !input.trim()) return;
    const text = input.trim();
    setInput("");
    const m = await sendMessage(activeId, meEmail, text);
    setMessages(prev => [...prev, m]);
    lastTs.current = m.createdAt;
    // scroll to bottom
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 0);
  }

  const activeOtherName = useMemo(
    () => threads.find(t => t.id === activeId)?.other.name || activeOtherEmail || "Student",
    [threads, activeId, activeOtherEmail]
  );

  return (
    <div className="grid gap-6 md:grid-cols-[18rem,1fr]">
      {/* LEFT: conversations */}
      <Card>
        <CardHeader><CardTitle>Conversations</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {threads.length === 0 && <div className="text-sm text-gray-600">No conversations yet.</div>}
          {threads.map(t => (
            <button
              key={t.id}
              onClick={() => openThread(t)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition
                          ${activeId===t.id ? "bg-gray-100 border-gray-300" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
                  {initials(t.other.name || t.other.email)}
                </div>
                <div>
                  <div className="font-medium">{t.other.name || t.other.email}</div>
                  <div className="text-xs text-gray-600">{t.other.email}</div>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* RIGHT: messages */}
      <Card className="flex min-h-[70vh] flex-col">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-700">
              {initials(activeOtherName)}
            </div>
            <CardTitle className="text-base">{activeOtherName}</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3">
          {/* SCROLL AREA */}
          <div ref={scrollRef} className="h-[55vh] w-full overflow-y-auto rounded-2xl border p-3">
            {(!activeId || messages.length === 0) && (
              <div className="text-sm text-gray-600">No messages yet. Say hi 👋</div>
            )}

            {/* Bubbles */}
            <div className="space-y-2">
              {messages.map((m, idx) => {
                const mine = !!myUserId && m.senderId === myUserId;
                const ts = new Date(m.createdAt);
                const timeStr = ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed
                                    ${mine ? "bg-gray-900 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                      <div>{m.text}</div>
                      <div className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-gray-500"}`}>{timeStr}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COMPOSER */}
          <form onSubmit={onSend} className="sticky bottom-0 mt-2 flex gap-2">
            <Input
              placeholder="Type a message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}