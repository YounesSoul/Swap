"use client";

import React from "react";
import { Clock, User, MessageSquare, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { GlowCard } from "@/components/ui/enhanced-components";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface RequestCardProps {
  request: {
    id: string;
    fromUser?: {
      id: string;
      name?: string;
      email: string;
      image?: string;
    };
    toUser?: {
      id: string;
      name?: string;
      email: string;
      image?: string;
    };
    // Legacy fields for backward compatibility
    fromName?: string;
    fromEmail?: string;
    toName?: string;
    toEmail?: string;
    courseCode?: string;
    skill?: string;
    skills?: Array<{ name: string }>;
    minutes?: number;
    note?: string;
    status: string;
    createdAt?: string;
    from?: string;
    to?: string;
  };
  type: "inbox" | "sent";
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = status?.toUpperCase?.() || 'UNKNOWN';
  const baseClasses = "inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full";
  
  if (s === 'PENDING') {
    return (
      <Badge className={`${baseClasses} bg-amber-100 text-amber-800 border border-amber-200`}>
        <AlertCircle className="w-3 h-3" />
        Pending
      </Badge>
    );
  }
  
  if (s === 'ACCEPTED' || s === 'CONFIRMED') {
    return (
      <Badge className={`${baseClasses} bg-emerald-100 text-emerald-800 border border-emerald-200`}>
        <CheckCircle className="w-3 h-3" />
        Accepted
      </Badge>
    );
  }
  
  if (s === 'DECLINED' || s === 'REJECTED') {
    return (
      <Badge className={`${baseClasses} bg-red-100 text-red-800 border border-red-200`}>
        <XCircle className="w-3 h-3" />
        Declined
      </Badge>
    );
  }
  
  return (
    <Badge className={`${baseClasses} bg-gray-100 text-gray-700 border border-gray-200`}>
      {s}
    </Badge>
  );
};

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  type,
  onAccept,
  onDecline,
}) => {
  // Extract user data from new structure or fall back to legacy fields
  const otherUser = type === "inbox" ? request.fromUser : request.toUser;
  const displayName = otherUser?.name || otherUser?.email || 
    (type === "inbox" 
      ? (request.fromName || request.fromEmail || request.from)
      : (request.toName || request.toEmail || request.to)
    );
  const userImage = otherUser?.image;
  const userEmail = otherUser?.email;
    
  const subject = request.courseCode || request.skill || request.skills?.[0]?.name || 'Session';
  const isPending = request.status?.toUpperCase() === 'PENDING';

  // Filter out generic/default notes
  const shouldShowNote = request.note && 
    !request.note.includes("Can we do a") && 
    !request.note.includes("1h session") &&
    request.note.trim().length > 0;

  return (
    <GlowCard className="group transition-all duration-300 hover:scale-[1.02]">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <img
              src={userImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail || displayName}`}
              alt={displayName || "User"}
              className="w-12 h-12 rounded-full border-2 border-white shadow-md"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {subject}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {type === "inbox" ? "From" : "To"}: <span className="font-medium">{displayName || "Unknown User"}</span>
                </span>
              </div>
            </div>
          </div>
          <StatusBadge status={request.status} />
        </div>

        {/* Duration and Time */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{request.minutes || 60} minutes</span>
          </div>
          {request.createdAt && (
            <div className="flex items-center space-x-1">
              <span>•</span>
              <span>{new Date(request.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Note */}
        {shouldShowNote && (
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{request.note}</p>
            </div>
          </div>
        )}

        {/* Skills Tags */}
        {request.skills && request.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {request.skills.slice(0, 3).map((skill) => (
              <Badge key={skill.name} className="text-xs bg-purple-100 text-purple-700">
                {skill.name}
              </Badge>
            ))}
            {request.skills.length > 3 && (
              <Badge className="text-xs bg-gray-100 text-gray-600">
                +{request.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        {type === "inbox" && isPending && (
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={() => onAccept?.(request.id)}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 text-sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept
            </Button>
            <Button
              onClick={() => onDecline?.(request.id)}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 text-sm"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Decline
            </Button>
          </div>
        )}
      </div>
    </GlowCard>
  );
};

export default RequestCard;