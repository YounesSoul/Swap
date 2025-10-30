
"use client";

import React, { useState } from "react";
import { useSwap } from "@/lib/store";
import { RequestCard } from "@/components/requests/RequestCard";
import { SimpleRequestStats } from "@/components/requests/SimpleRequestStats";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RequestsPage() {
  const { inbox, sent, acceptRequest, declineRequest, clearAnsweredRequests, clearAllRequests, me } = useSwap(s => ({
    inbox: s.inbox,
    sent: s.sent,
    acceptRequest: s.acceptRequest,
    declineRequest: s.declineRequest,
    clearAnsweredRequests: s.clearAnsweredRequests,
    clearAllRequests: s.clearAllRequests,
    me: s.me
  }));

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const handleAccept = async (id: string) => {
    try {
      await acceptRequest(id);
      toast.success("Request accepted!");
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await declineRequest(id);
      toast.success("Request declined");
    } catch (error) {
      toast.error("Failed to decline request");
    }
  };

  const handleQuickAction = (action: string) => {
    setActiveFilter(action);
    // You can add scrolling to specific sections here
  };

  const handleClearAnswered = async () => {
    try {
      await clearAnsweredRequests();
      toast.success("Cleared all answered requests!");
    } catch (error) {
      toast.error("Failed to clear requests");
    }
  };

  const handleClearAll = async () => {
    if (confirm("Are you sure you want to clear ALL requests? This cannot be undone.")) {
      try {
        await clearAllRequests();
        toast.success("Cleared all requests!");
      } catch (error) {
        toast.error("Failed to clear requests");
      }
    }
  };

  // Calculate stats
  const stats = {
    inboxCount: inbox.length,
    sentCount: sent.length,
    pendingCount: [...inbox, ...sent].filter(r => r.status?.toUpperCase() === 'PENDING').length,
    acceptedCount: [...inbox, ...sent].filter(r => r.status?.toUpperCase() === 'ACCEPTED').length,
    declinedCount: [...inbox, ...sent].filter(r => r.status?.toUpperCase() === 'DECLINED').length,
    totalRequests: inbox.length + sent.length,
  };

  // Filter requests based on activeFilter
  const filterRequests = (requests: any[]) => {
    if (activeFilter === "all") return requests;
    if (activeFilter === "pending") return requests.filter(r => r.status?.toUpperCase() === 'PENDING');
    if (activeFilter === "accepted") return requests.filter(r => r.status?.toUpperCase() === 'ACCEPTED');
    if (activeFilter === "declined") return requests.filter(r => r.status?.toUpperCase() === 'DECLINED');
    return requests;
  };

  const filteredInbox = filterRequests(inbox);
  const filteredSent = filterRequests(sent);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-6 py-8 max-w-7xl space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Request Management</h1>
          <p className="text-gray-500 text-sm font-medium mb-4">Manage your tutoring requests and track their status</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700 font-medium">
              💡 Want to book a new session?{" "}
              <Link href="/matches" className="font-semibold underline hover:text-blue-800">
                Search for teachers
              </Link>{" "}
              and send requests directly!
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <SimpleRequestStats stats={stats} onQuickAction={handleQuickAction} />

        {/* Filter Pills */}
        <div className="flex justify-center gap-2">
          {["all", "pending", "accepted", "declined"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeFilter === filter
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3">
          <Button
            onClick={handleClearAnswered}
            variant="outline"
            className="font-semibold"
          >
            Clear Answered Requests
          </Button>
        </div>

        {/* Requests Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Inbox */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>Inbox</span>
                <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
                  {filteredInbox.length}
                </span>
              </h2>
            </div>
            
            {filteredInbox.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                <div className="text-4xl mb-3">📬</div>
                <p className="text-gray-400 font-medium">No incoming requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInbox.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    type="inbox"
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sent */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>Sent</span>
                <span className="bg-purple-100 text-purple-600 text-sm font-semibold px-3 py-1 rounded-full">
                  {filteredSent.length}
                </span>
              </h2>
            </div>
            
            {filteredSent.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                <div className="text-4xl mb-3">📤</div>
                <p className="text-gray-400 font-medium">No sent requests found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSent.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    type="sent"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <details className="max-w-md mx-auto">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center gap-2">
              <span>⚙️</span>
              <span>Advanced Actions</span>
            </summary>
            <div className="mt-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <p className="text-xs text-gray-500 font-medium mb-3">
                ⚠️ Use with caution - these actions cannot be undone
              </p>
              <Button
                onClick={handleClearAll}
                variant="outline"
                className="w-full font-semibold text-red-600 border-red-200 hover:bg-red-50"
              >
                Clear ALL Requests
              </Button>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
