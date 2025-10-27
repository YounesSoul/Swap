"use client";

import React from "react";
import { 
  Clock, 
  User, 
  Calendar, 
  MessageSquare, 
  CheckCircle, 
  Star, 
  Eye,
  Play,
  BookOpen
} from "lucide-react";
import { GlowCard } from "@/components/ui/enhanced-components";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SessionCardProps {
  session: {
    id: string;
    courseCode: string;
    minutes: number;
    status: "scheduled" | "done";
    startAt?: string | null;
    teacher?: {
      id: string;
      name?: string;
      email: string;
      image?: string;
    };
    learner?: {
      id: string;
      name?: string;
      email: string;
      image?: string;
    };
    teacherId: string;
    learnerId: string;
  };
  currentUser: {
    id: string;
    email: string;
  };
  isRated?: boolean;
  onSchedule?: (sessionId: string) => void;
  onComplete?: (sessionId: string) => void;
  onRate?: (session: any, teacher: any) => void;
}

const StatusBadge: React.FC<{ status: string; startTime?: string }> = ({ status, startTime }) => {
  if (status === "done") {
    return (
      <div className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
        <CheckCircle className="w-3 h-3" />
        Completed
      </div>
    );
  }

  if (startTime) {
    const startDate = new Date(startTime);
    const now = new Date();
    const isUpcoming = startDate > now;
    
    return (
      <div className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
        isUpcoming 
          ? "bg-blue-100 text-blue-800 border border-blue-200" 
          : "bg-purple-100 text-purple-800 border border-purple-200"
      }`}>
        <Calendar className="w-3 h-3" />
        {isUpcoming ? "Scheduled" : "In Progress"}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200">
      <Clock className="w-3 h-3" />
      Needs Scheduling
    </div>
  );
};

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  currentUser,
  isRated = false,
  onSchedule,
  onComplete,
  onRate,
}) => {
  const isLearner = session.learner?.email === currentUser.email;
  const otherUser = isLearner ? session.teacher : session.learner;
  const isDone = session.status === "done";
  const needsScheduling = !session.startAt && !isDone;

  return (
    <GlowCard className="group transition-all duration-300 hover:scale-[1.02]">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <img
              src={otherUser?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.email}`}
              alt={otherUser?.name || "User"}
              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-gray-500" />
                <span>{session.courseCode}</span>
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {isLearner ? "Teacher" : "Student"}: <span className="font-medium">{otherUser?.name || otherUser?.email}</span>
                </span>
              </div>
            </div>
          </div>
          <StatusBadge status={session.status} startTime={session.startAt || undefined} />
        </div>

        {/* Session Details */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{session.minutes} minutes</span>
          </div>
          {session.startAt && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(session.startAt).toLocaleDateString()}</span>
            </div>
          )}
          {session.startAt && (
            <div className="flex items-center space-x-1">
              <span>•</span>
              <span>{new Date(session.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
        </div>

        {/* Completion Message */}
        {isDone && (
          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Session completed successfully!</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          {/* Message Button */}
          {otherUser?.email && (
            <Link href={`/chat?with=${encodeURIComponent(otherUser.email)}`}>
              <Button variant="outline" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </Button>
            </Link>
          )}

          {/* Schedule Button */}
          {needsScheduling && (
            <Button
              onClick={() => onSchedule?.(session.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </Button>
          )}

          {/* Complete Button */}
          {!isDone && session.startAt && (
            <Button
              onClick={() => onComplete?.(session.id)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark as Done</span>
            </Button>
          )}

          {/* View Teacher Ratings */}
          {isDone && (
            <Link href={`/ratings?userId=${session.teacherId}`}>
              <Button variant="outline" className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>View Ratings</span>
              </Button>
            </Link>
          )}

          {/* Rate Teacher Button */}
          {isDone && isLearner && !isRated && (
            <Button
              onClick={() => onRate?.(session, {
                id: session.teacherId,
                name: session.teacher?.name || session.teacher?.email,
                email: session.teacher?.email
              })}
              className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center space-x-2"
            >
              <Star className="w-4 h-4" />
              <span>Rate Teacher</span>
            </Button>
          )}

          {/* Rated Indicator */}
          {isDone && isLearner && isRated && (
            <div className="px-4 py-2 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Rated</span>
            </div>
          )}
        </div>
      </div>
    </GlowCard>
  );
};

export default SessionCard;