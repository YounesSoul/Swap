"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { 
  Inbox, 
  Send, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";

interface RequestStatsCarouselProps {
  stats: {
    inboxCount: number;
    sentCount: number;
    pendingCount: number;
    acceptedCount: number;
    declinedCount: number;
    totalRequests: number;
  };
  onQuickAction?: (action: string) => void;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: string;
  bgColor: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  title, 
  value, 
  color, 
  bgColor, 
  onClick 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.05,
        y: -5,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`${bgColor} ${onClick ? 'cursor-pointer' : ''} rounded-xl p-4 min-w-[140px] shadow-sm border border-white/20`}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className={`${color} p-2 rounded-lg bg-white/10`}>
          {icon}
        </div>
        <div>
          <div className={`text-2xl font-bold ${color}`}>
            {value}
          </div>
          <div className={`text-xs ${color} opacity-80`}>
            {title}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RequestStatsCarousel: React.FC<RequestStatsCarouselProps> = ({
  stats,
  onQuickAction,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Animate cards on mount
    const cards = carousel.querySelectorAll('.stat-card');
    gsap.fromTo(cards, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out" 
      }
    );
  }, []);

  const statCards = [
    {
      icon: <Inbox className="w-5 h-5" />,
      title: "Inbox",
      value: stats.inboxCount,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
      action: "inbox",
    },
    {
      icon: <Send className="w-5 h-5" />,
      title: "Sent",
      value: stats.sentCount,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
      action: "sent",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Pending",
      value: stats.pendingCount,
      color: "text-amber-600",
      bgColor: "bg-gradient-to-br from-amber-100 to-amber-200",
      action: "pending",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Accepted",
      value: stats.acceptedCount,
      color: "text-emerald-600",
      bgColor: "bg-gradient-to-br from-emerald-100 to-emerald-200",
      action: "accepted",
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      title: "Declined",
      value: stats.declinedCount,
      color: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-100 to-red-200",
      action: "declined",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "Total",
      value: stats.totalRequests,
      color: "text-gray-600",
      bgColor: "bg-gradient-to-br from-gray-100 to-gray-200",
      action: "total",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-center mb-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">Request Overview</h3>
          <div className="text-sm text-gray-500">
            Quick stats and actions
          </div>
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="flex justify-center space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {statCards.map((card, index) => (
          <div key={card.action} className="stat-card flex-shrink-0">
            <StatCard
              icon={card.icon}
              title={card.title}
              value={card.value}
              color={card.color}
              bgColor={card.bgColor}
              onClick={() => onQuickAction?.(card.action)}
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RequestStatsCarousel;