"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchHeader } from "@/components/search/SearchHeader";
import { SearchResultsGrid } from "@/components/search/SearchResultsNew";
import { ChromaGrid } from "@/components/ui/enhanced-components";
import { useSwap } from "@/lib/store";
import { toast } from "sonner";

export default function MatchesPage() {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"skill" | "course">("skill");
  const search = useSwap((s) => s.searchTeachers);
  const results = useSwap((s) => s.searchResults);
  const sendRequest = useSwap((s) => s.sendRequest);
  const me = useSwap((s) => s.me);
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

  // Transform results to match SearchResults component format
  const searchResults = results.map((r: any) => {
    const isMe = r.user.email?.toLowerCase() === me?.email?.toLowerCase();
    const label = (r.course?.code || (r.skills?.[0]?.name ?? "SKILL")).toString();
    
    return {
      id: r.user.email,
      title: r.user.name || r.user.email,
      description: r.skills 
        ? `Skills: ${r.skills.map((s: any) => `${s.name} (${s.level})`).join(", ")}`
        : r.course 
        ? `Aced: ${r.course.code} (${r.course.grade})`
        : "No description available",
      type: mode as "skill" | "course",
      rating: r.ratingData?.averageRating || 0,
      reviewCount: r.ratingData?.totalRatings || 0,
      instructor: r.user.name || r.user.email,
      level: r.skills?.[0]?.level || "Intermediate",
      duration: "1 hour",
      tags: r.skills 
        ? r.skills.map((s: any) => s.name)
        : r.course 
        ? [r.course.code]
        : [],
      image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user.email}`,
      isMe,
      originalData: r,
      label
    };
  });

  const handleResultClick = async (result: any) => {
    if (result.isMe) return;
    
    // You can implement different actions here
    // For now, let's open the chat
    window.open(`/chat?with=${encodeURIComponent(result.id)}`, "_self");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Beautiful Search Header */}
        <SearchHeader
          searchQuery={q}
          onSearchChange={setQ}
          onSearch={onSearch}
          mode={mode}
          onModeChange={setMode}
        />

        {/* Results Section with ChromaGrid Background */}
        <div className="mt-12 relative">
          <ChromaGrid className="absolute inset-0 opacity-20">
            <div></div>
          </ChromaGrid>
          
          <div className="relative z-10">
            <SearchResultsGrid
              results={searchResults}
              loading={loading}
              hasSearched={!!q && results.length >= 0}
              onResultClick={handleResultClick}
              customActions={(result: any) => (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                      disabled={result.isMe}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/chat?with=${encodeURIComponent(result.id)}`, "_self");
                      }}
                    >
                      {result.isMe ? "It's you" : "Message"}
                    </button>
                    
                    <button
                      className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                      disabled={result.isMe || bookingEmail === result.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBook(result.id, result.label);
                      }}
                    >
                      {bookingEmail === result.id ? "Booking..." : "Book Session"}
                    </button>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </div>

    </div>
  );
}