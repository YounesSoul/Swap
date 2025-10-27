"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { 
  User, 
  BookOpen, 
  Award, 
  Clock,
  Target,
  TrendingUp
} from "lucide-react";

interface ProfileStatsCarouselProps {
  stats: {
    totalSkills: number;
    totalCourses: number;
    completionRate: number;
    teachingHours: number;
    profileCompletion: number;
    activeRequests: number;
  };
  onFilterChange?: (filter: string) => void;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  isActive?: boolean;
  onClick?: () => void;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  bgGradient,
  isActive = false,
  onClick,
  delay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Initial animation
    gsap.fromTo(
      card,
      {
        y: 50,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: delay,
        ease: "back.out(1.7)",
      }
    );

    // Hover animations
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

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`
        relative p-6 rounded-2xl shadow-lg transition-all duration-300 cursor-pointer
        ${bgGradient}
        ${isActive ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
        ${onClick ? 'hover:shadow-xl' : ''}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`${color} mb-2`}>
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </div>
      
      {/* Animated background element */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export const ProfileStatsCarousel: React.FC<ProfileStatsCarouselProps> = ({
  stats,
  onFilterChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = React.useState<string>("all");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Animate container
    gsap.fromTo(
      container,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  const statCards = [
    {
      title: "Skills",
      value: stats.totalSkills,
      subtitle: "Teaching abilities",
      icon: <Award className="w-6 h-6" />,
      color: "text-blue-600",
      bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100",
      filter: "skills",
    },
    {
      title: "Courses",
      value: stats.totalCourses,
      subtitle: "Academic expertise",
      icon: <BookOpen className="w-6 h-6" />,
      color: "text-emerald-600",
      bgGradient: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      filter: "courses",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      subtitle: "Session success",
      icon: <Target className="w-6 h-6" />,
      color: "text-purple-600",
      bgGradient: "bg-gradient-to-br from-purple-50 to-purple-100",
      filter: "all",
    },
    {
      title: "Teaching Hours",
      value: `${stats.teachingHours}h`,
      subtitle: "Total time taught",
      icon: <Clock className="w-6 h-6" />,
      color: "text-orange-600",
      bgGradient: "bg-gradient-to-br from-orange-50 to-orange-100",
      filter: "all",
    },
    {
      title: "Profile Complete",
      value: `${stats.profileCompletion}%`,
      subtitle: "Setup progress",
      icon: <User className="w-6 h-6" />,
      color: "text-pink-600",
      bgGradient: "bg-gradient-to-br from-pink-50 to-pink-100",
      filter: "all",
    },
    {
      title: "Active Requests",
      value: stats.activeRequests,
      subtitle: "Pending matches",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-indigo-600",
      bgGradient: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      filter: "active",
    },
  ];

  return (
    <div ref={containerRef} className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Overview</h2>
        <p className="text-gray-600">Track your learning profile and teaching progress</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, index) => (
          <StatCard
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
            bgGradient={card.bgGradient}
            isActive={activeFilter === card.filter}
            onClick={onFilterChange ? () => handleFilterClick(card.filter) : undefined}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

export default ProfileStatsCarousel;