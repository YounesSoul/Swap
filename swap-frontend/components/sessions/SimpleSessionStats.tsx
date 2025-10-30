"use client";

import React from "react";
import { 
  Clock, 
  CheckCircle, 
  Calendar, 
  BookOpen
} from "lucide-react";

interface SimpleSessionStatsProps {
  stats: {
    total: number;
    scheduled: number;
    completed: number;
    totalHours: number;
    uniqueCourses: number;
    needsScheduling: number;
  };
  onFilterChange?: (filter: string) => void;
}

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  accentColor: string;
  onClick?: () => void;
  isClickable?: boolean;
}

const StatCard = ({ 
  label, 
  value, 
  subtitle, 
  icon, 
  iconBgColor, 
  iconColor, 
  accentColor,
  onClick,
  isClickable = false
}: StatCardProps) => {
  return (
    <div 
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-bold ${accentColor}`}>
              {value}
            </span>
            <span className="text-sm font-medium text-gray-500">
              {subtitle}
            </span>
          </div>
        </div>
        <div className={`p-3 ${iconBgColor} rounded-xl`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export const SimpleSessionStats: React.FC<SimpleSessionStatsProps> = ({ stats, onFilterChange }) => {
  const statsData = [
    {
      label: "Total Sessions",
      value: stats.total,
      subtitle: "sessions",
      icon: <BookOpen className="h-6 w-6" />,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      accentColor: "text-blue-600",
      filter: "all"
    },
    {
      label: "Scheduled",
      value: stats.scheduled,
      subtitle: "upcoming",
      icon: <Calendar className="h-6 w-6" />,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      accentColor: "text-purple-600",
      filter: "scheduled"
    },
    {
      label: "Completed",
      value: stats.completed,
      subtitle: "done",
      icon: <CheckCircle className="h-6 w-6" />,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
      accentColor: "text-green-600",
      filter: "completed"
    },
    {
      label: "Total Hours",
      value: stats.totalHours,
      subtitle: "hours",
      icon: <Clock className="h-6 w-6" />,
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      accentColor: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <StatCard 
          key={index} 
          {...stat} 
          onClick={stat.filter && onFilterChange ? () => onFilterChange(stat.filter) : undefined}
          isClickable={!!stat.filter && !!onFilterChange}
        />
      ))}
    </div>
  );
};
