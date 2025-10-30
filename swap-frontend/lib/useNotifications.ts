"use client";

import { useMemo } from 'react';
import { useSwap } from '@/lib/store';

export interface NotificationCounts {
  requests: number;
  chat: number;
  sessions: number;
  total: number;
}

export const useNotificationCounts = (): NotificationCounts => {
  const inbox = useSwap(s => s.inbox);
  const sessions = useSwap(s => s.sessions);

  return useMemo(() => {
    console.log('useNotificationCounts - inbox:', inbox);
    console.log('useNotificationCounts - sessions:', sessions);

    // Count pending requests in inbox
    const pendingRequests = (Array.isArray(inbox) ? inbox : []).filter(request => 
      request.status === 'PENDING'
    ).length;

    // Count upcoming sessions that need attention
    const upcomingSessions = (Array.isArray(sessions) ? sessions : []).filter(session => {
      if (session.status === 'done') return false;
      
      // If no start time is set, it needs scheduling
      if (!session.startAt) return true;
      
      // If session is within next 24 hours, it's "upcoming"
      const startTime = new Date(session.startAt).getTime();
      const now = Date.now();
      const in24Hours = now + (24 * 60 * 60 * 1000);
      
      return startTime > now && startTime <= in24Hours;
    }).length;

    // For chat, we'll simulate some unread messages for demo purposes
    // In a real implementation, this would come from a chat service
    // that tracks read/unread status per thread per user
    const unreadMessages = 0; // TODO: Implement real unread message tracking

    const total = pendingRequests + upcomingSessions + unreadMessages;

    const result = {
      requests: pendingRequests,
      chat: unreadMessages,
      sessions: upcomingSessions,
      total
    };

    console.log('useNotificationCounts - result:', result);
    return result;
  }, [inbox, sessions]);
};

// Hook for specific notification types
export const useRequestNotifications = () => {
  const counts = useNotificationCounts();
  return counts.requests;
};

export const useChatNotifications = () => {
  const counts = useNotificationCounts();
  return counts.chat;
};

export const useSessionNotifications = () => {
  const counts = useNotificationCounts();
  return counts.sessions;
};