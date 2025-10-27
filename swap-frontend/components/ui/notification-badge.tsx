"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  className?: string;
  dotClassName?: string;
  show?: boolean;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  maxCount = 99,
  className,
  dotClassName,
  show = true
}) => {
  console.log('NotificationBadge rendered with count:', count, 'show:', show);
  
  if (!show || count === 0) {
    console.log('NotificationBadge not showing - show:', show, 'count:', count);
    return null;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  console.log('NotificationBadge displaying count:', displayCount);

  return (
    <span
      className={cn(
        "absolute -top-1 -right-1 inline-flex items-center justify-center",
        "min-w-[18px] h-[18px] px-1",
        "text-xs font-medium text-white",
        "bg-red-500 rounded-full border-2 border-white",
        "shadow-sm z-10",
        "animate-pulse duration-1000",
        className
      )}
    >
      {count > 0 && count <= 9 ? (
        <span className={cn("text-[10px] font-bold", dotClassName)}>
          {displayCount}
        </span>
      ) : count > 9 ? (
        <span className={cn("text-[9px] font-bold leading-none", dotClassName)}>
          {displayCount}
        </span>
      ) : null}
    </span>
  );
};

// Simpler dot indicator for cases where you just want a dot
export const NotificationDot: React.FC<{
  show?: boolean;
  className?: string;
}> = ({ show = true, className }) => {
  if (!show) return null;

  return (
    <span
      className={cn(
        "absolute -top-1 -right-1",
        "w-3 h-3 bg-red-500 rounded-full border-2 border-white",
        "animate-pulse duration-1000",
        className
      )}
    />
  );
};