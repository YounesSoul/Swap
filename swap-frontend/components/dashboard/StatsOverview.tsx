"use client";

import { useSwap } from "@/lib/store";
import { Briefcase, Clock, Users, Inbox } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  accentColor: string;
}

const StatCard = ({ label, value, subtitle, icon, iconBgColor, iconColor, accentColor }: StatCardProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
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

export const StatsOverview = () => {
  const sessions = useSwap(s => s.sessions);
  const tokenBalance = useSwap(s => s.tokenBalance);
  const inbox = useSwap(s => s.inbox);
  
  // Calculate stats
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s: any) => s.status === 'done' || s.status === 'completed').length;
  const totalMinutes = sessions.reduce((acc, s) => acc + (s as any).minutes, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const pendingRequests = inbox.filter(r => r.status === 'PENDING').length;

  const stats = [
    {
      label: "Total Sessions",
      value: totalSessions,
      subtitle: "sessions",
      icon: <Briefcase className="h-6 w-6" />,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
      accentColor: "text-green-600"
    },
    {
      label: "Learning Hours",
      value: `${hours}.${minutes}`,
      subtitle: "hours",
      icon: <Clock className="h-6 w-6" />,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      accentColor: "text-blue-600"
    },
    {
      label: "Completed Sessions",
      value: completedSessions,
      subtitle: "done",
      icon: <Users className="h-6 w-6" />,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      accentColor: "text-purple-600"
    },
    {
      label: "Pending Requests",
      value: pendingRequests,
      subtitle: "waiting",
      icon: <Inbox className="h-6 w-6" />,
      iconBgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      accentColor: "text-indigo-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
