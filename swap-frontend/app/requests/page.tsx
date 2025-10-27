
"use client";

import React, { useState } from "react";
import { useSwap } from "@/lib/store";
import { ChromaGrid } from "@/components/ui/enhanced-components";
import { RequestCard } from "@/components/requests/RequestCard";
import { RequestStatsCarousel } from "@/components/requests/RequestStatsCarousel";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Background Effects */}
      <ChromaGrid className="absolute inset-0 opacity-10">
        <div></div>
      </ChromaGrid>

      <div className="relative z-10 container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-gray-900">Request Management</h1>
          <p className="text-gray-600">Manage your tutoring requests and track their status</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto">
            <p className="text-sm text-blue-700">
              💡 Want to book a new session? Head to the{" "}
              <a href="/matches" className="font-medium underline hover:text-blue-800">
                Search page
              </a>{" "}
              to find teachers and send requests directly!
            </p>
          </div>
        </div>

        {/* Stats Carousel */}
        <RequestStatsCarousel stats={stats} onQuickAction={handleQuickAction} />

        {/* Filter Pills */}
        <div className="flex justify-center space-x-2">
          {["all", "pending", "accepted", "declined"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Clear Answered Requests Button */}
        <div className="flex justify-center">
          <button
            onClick={handleClearAnswered}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Clear Answered Requests</span>
          </button>
        </div>

        {/* Requests Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Inbox */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <span>Inbox</span>
              <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                {filteredInbox.length}
              </span>
            </h2>
            
            {filteredInbox.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📬</div>
                <p>No incoming requests found</p>
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
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <span>Sent</span>
              <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">
                {filteredSent.length}
              </span>
            </h2>
            
            {filteredSent.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📤</div>
                <p>No sent requests found</p>
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

        {/* Admin Actions - Discrete placement at bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <details className="max-w-md mx-auto">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Advanced Actions</span>
            </summary>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-3">
                ⚠️ Use with caution - these actions cannot be undone
              </p>
              <button
                onClick={handleClearAll}
                className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear ALL Requests (Including Pending)</span>
              </button>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
