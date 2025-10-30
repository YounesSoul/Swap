"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchResultsGrid } from "@/components/search/SearchResults";
import { ChromaGrid } from "@/components/ui/enhanced-components";
import { useSwap } from "@/lib/store";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

export default function MatchesPage() {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"skill" | "course">("skill");
  const search = useSwap((s) => s.searchTeachers);
  const results = useSwap((s) => s.searchResults);
  const sendRequest = useSwap((s) => s.sendRequest);
  const me = useSwap((s) => s.me);
  const myInterests = useSwap((s) => s.myInterests);
  const router = useRouter();
  const [bookingEmail, setBookingEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSearch() {
    if (!q.trim()) return;
    setLoading(true);
    try {
      await search(mode === "skill" ? { skill: q.trim() } : { course: q.trim().toUpperCase() });
    } finally {
      setLoading(false);
    }
  }

  async function onBook(email: string, label: string) {
    setBookingEmail(email);
    const res = await sendRequest(email, label, 60, "Can we do a 1h session?");
    setBookingEmail(null);

    if (res.ok) {
      toast.success("Request sent", { description: "You can track it in Requests." });
      router.push("/requests");
    } else {
      const msg = res.error || "Could not send request.";
      toast.error(msg);
    }
  }

  async function onBookTimeSlot(
    email: string, 
    timeSlotId: string, 
    dayOfWeek: string, 
    startTime: string, 
    endTime: string
  ) {
    if (!me?.email) {
      toast.error("Please sign in to book");
      return;
    }

    setBookingEmail(email);
    
    try {
      const label = mode === "skill" ? q.trim() : q.trim().toUpperCase();
      
      // Send booking request with time slot
      const response = await fetch(`${API_BASE}/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromEmail: me.email,
          toEmail: email,
          courseCode: label,
          minutes: 60,
          note: `Booking for ${dayOfWeek} ${startTime}-${endTime}`,
          timeSlotId, // Include timeslot info in the request
        }),
      });

      if (response.ok) {
        toast.success("Request sent!", {
          description: `Teacher will be notified about ${dayOfWeek} ${startTime}-${endTime}`,
        });
        router.push("/requests");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to send request");
      }
    } catch (error) {
      toast.error("Failed to send request");
    } finally {
      setBookingEmail(null);
    }
  }

  function onMessage(email: string) {
    router.push(`/chat?with=${encodeURIComponent(email)}`);
  }

  function handleInterestClick(interest: { type: 'skill' | 'course', name: string }) {
    setMode(interest.type);
    setQ(interest.name);
    setTimeout(() => {
      search(interest.type === 'skill' ? { skill: interest.name } : { course: interest.name.toUpperCase() });
    }, 100);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Your Learning Interests */}
        {myInterests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Learning Interests</h2>
            <div className="flex flex-wrap gap-2">
              {myInterests.map((interest, i) => (
                <button
                  key={i}
                  onClick={() => handleInterestClick(interest)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                    interest.type === 'skill'
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {interest.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Beautiful Search Header */}
        <SearchHeader
          searchQuery={q}
          onSearchChange={setQ}
          onSearch={onSearch}
          mode={mode}
          onModeChange={setMode}
        />

        {/* Results Section */}
        <div className="mt-12">
          <SearchResultsGrid
            results={results}
            me={me}
            onMessage={onMessage}
            onBook={onBook}
            onBookTimeSlot={onBookTimeSlot}
            bookingEmail={bookingEmail}
            mode={mode}
            searchQuery={q}
            onSearch={(query) => {
              setQ(query);
              setTimeout(onSearch, 100);
            }}
          />
        </div>
      </div>

    </div>
  );
}