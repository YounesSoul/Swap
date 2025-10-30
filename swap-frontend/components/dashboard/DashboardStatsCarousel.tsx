"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { useSwap } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { 
  User, 
  BookOpen, 
  Award, 
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  Calendar,
  Users,
  Inbox,
  Send,
  XCircle,
  GraduationCap,
  Activity,
  Settings,
  X,
  Check
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  delay?: number;
  onClick?: () => void;
}

interface StatDefinition {
  key: string;
  title: string;
  getValue: (stats: any) => string | number;
  getSubtitle: (stats: any) => string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

interface StatsCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableStats: StatDefinition[];
  selectedStats: string[];
  onSelectionChange: (selected: string[]) => void;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  bgGradient,
  delay = 0,
  onClick
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Initial animation
    gsap.set(card, { 
      opacity: 0, 
      y: 30,
      scale: 0.9 
    });

    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      delay: delay * 0.1,
      ease: "back.out(1.7)",
    });

    // Hover animations
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
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
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${bgGradient} backdrop-blur-sm 
                  border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 
                  cursor-pointer group min-h-[140px] flex flex-col justify-between`}
      onClick={onClick}
    >
      <div className="mb-3">
        <p className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
          {title}
        </p>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-4xl font-bold text-white mb-1">
            {value}
          </div>
          {subtitle && (
            <div className="text-sm font-medium text-white/70">
              {subtitle}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-white/20 text-white group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-2 right-2 w-20 h-20 bg-white/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
      <div className="absolute bottom-2 left-2 w-12 h-12 bg-white/10 rounded-full translate-y-6 -translate-x-6 group-hover:scale-125 transition-transform duration-700" />
    </div>
  );
};

const StatsCustomizationModal: React.FC<StatsCustomizationModalProps> = ({
  isOpen,
  onClose,
  availableStats,
  selectedStats,
  onSelectionChange
}) => {
  const [tempSelection, setTempSelection] = useState<string[]>(selectedStats);
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  const handleStatToggle = (statKey: string) => {
    const isCurrentlySelected = tempSelection.includes(statKey);
    
    if (isCurrentlySelected) {
      // Remove if selected and we have more than 1 selected
      if (tempSelection.length > 1) {
        setTempSelection(prev => prev.filter(key => key !== statKey));
      }
    } else {
      // Add if not selected and we have less than 4 selected
      if (tempSelection.length < 4) {
        setTempSelection(prev => [...prev, statKey]);
      }
    }
  };

  const handleSave = () => {
    onSelectionChange(tempSelection);
    onClose();
  };

  const handleCancel = () => {
    setTempSelection(selectedStats);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-500 to-purple-600 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Customize Your Stats</h2>
              <p className="text-indigo-100 mt-1">Choose 4 stats to display on your dashboard</p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-600">
                Selected: {tempSelection.length}/4
              </span>
              <div className="text-xs text-gray-500">
                Select exactly 4 stats to display
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableStats.map((stat) => {
              const isSelected = tempSelection.includes(stat.key);
              const canSelect = tempSelection.length < 4 || isSelected;
              const canDeselect = tempSelection.length > 1 || !isSelected;
              
              return (
                <div
                  key={stat.key}
                  className={`
                    relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                    ${isSelected 
                      ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                      : canSelect 
                        ? 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50' 
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
                    }
                  `}
                  onClick={() => (canSelect && canDeselect) && handleStatToggle(stat.key)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.bgGradient}`}>
                      <div className="text-white">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{stat.title}</h3>
                      <p className="text-sm text-gray-600 truncate">Track your progress</p>
                    </div>
                    {isSelected && (
                      <div className="p-1 bg-indigo-500 rounded-full">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {tempSelection.length === 4 ? (
                <span className="text-green-600 font-medium">✓ Perfect! 4 stats selected</span>
              ) : (
                `Select ${4 - tempSelection.length} more stat${4 - tempSelection.length !== 1 ? 's' : ''}`
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={tempSelection.length !== 4}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export const DashboardStatsCarousel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [selectedStatKeys, setSelectedStatKeys] = useState<string[]>([]);
  
  const me = useSwap(s => s.me);
  const mySkills = useSwap(s => s.mySkills);
  const myCourses = useSwap(s => s.myCourses);
  const sessions = useSwap(s => s.sessions);
  const inbox = useSwap(s => s.inbox);
  const sent = useSwap(s => s.sent);

  // Calculate comprehensive stats
  const stats = useMemo(() => {
    // Ensure arrays are valid
    const safeInbox = Array.isArray(inbox) ? inbox : [];
    const safeSent = Array.isArray(sent) ? sent : [];
    const safeSessions = Array.isArray(sessions) ? sessions : [];
    const safeSkills = Array.isArray(mySkills) ? mySkills : [];
    const safeCourses = Array.isArray(myCourses) ? myCourses : [];

    // Profile stats
    const totalSkills = safeSkills.length;
    const totalCourses = safeCourses.length;
    const profileFields = [me?.name, me?.email, totalSkills, totalCourses];
    const profileCompletion = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

    // Session stats
    const completedSessions = safeSessions.filter((s: any) => s.status === 'completed').length;
    const scheduledSessions = safeSessions.filter((s: any) => s.status === 'scheduled').length;
    const totalSessions = safeSessions.length;
    const totalMinutes = safeSessions.reduce((acc: number, s: any) => acc + (s.minutes || 0), 0);
    const totalHours = Math.floor(totalMinutes / 60);

    // Request stats
    const inboxRequests = safeInbox.filter((r: any) => r.status === 'PENDING').length;
    const sentRequests = safeSent.length;
    const acceptedRequests = [...safeInbox, ...safeSent].filter((r: any) => r.status === 'ACCEPTED').length;
    const totalRequests = safeInbox.length + safeSent.length;

    // Activity stats
    const thisWeekSessions = sessions?.filter((s: any) => {
      const sessionDate = new Date(s.startAt || Date.now());
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return sessionDate >= weekAgo;
    }).length || 0;

    return {
      totalSessions,
      completedSessions,
      scheduledSessions,
      totalHours,
      totalSkills,
      totalCourses,
      profileCompletion,
      inboxRequests,
      sentRequests,
      acceptedRequests,
      totalRequests,
      thisWeekSessions
    };
  }, [me, mySkills, myCourses, sessions, inbox, sent]);

  // Define all available stats
  const allStatDefinitions: StatDefinition[] = useMemo(() => [
    {
      key: "totalSessions",
      title: "Total Sessions",
      getValue: (stats) => stats.totalSessions,
      getSubtitle: (stats) => `${stats.completedSessions} completed`,
      icon: <Calendar className="h-5 w-5" />,
      color: "blue-400",
      bgGradient: "from-blue-500 to-blue-600",
    },
    {
      key: "learningHours",
      title: "Learning Hours",
      getValue: (stats) => `${stats.totalHours}h`,
      getSubtitle: (stats) => `${stats.totalHours * 60 - (stats.totalHours * 60)} min`,
      icon: <Clock className="h-5 w-5" />,
      color: "blue-400", 
      bgGradient: "from-blue-600 to-blue-700",
    },
    {
      key: "skillsToTeach",
      title: "Skills to Teach",
      getValue: (stats) => stats.totalSkills,
      getSubtitle: () => "areas of expertise",
      icon: <GraduationCap className="h-5 w-5" />,
      color: "gray-400",
      bgGradient: "from-gray-700 to-gray-800",
    },
    {
      key: "coursesLearning",
      title: "Courses Learning",
      getValue: (stats) => stats.totalCourses,
      getSubtitle: () => "active learning",
      icon: <BookOpen className="h-5 w-5" />,
      color: "blue-400",
      bgGradient: "from-blue-500 to-blue-600",
    },
    {
      key: "profileComplete",
      title: "Profile Complete",
      getValue: (stats) => `${stats.profileCompletion}%`,
      getSubtitle: () => "profile strength",
      icon: <User className="h-5 w-5" />,
      color: "gray-400",
      bgGradient: "from-gray-600 to-gray-700",
    },
    {
      key: "pendingRequests",
      title: "Pending Requests",
      getValue: (stats) => stats.inboxRequests,
      getSubtitle: (stats) => `${stats.sentRequests} sent`,
      icon: <Inbox className="h-5 w-5" />,
      color: "blue-400",
      bgGradient: "from-blue-600 to-blue-700",
    },
    {
      key: "thisWeek",
      title: "This Week",
      getValue: (stats) => stats.thisWeekSessions,
      getSubtitle: () => "sessions completed",
      icon: <Activity className="h-5 w-5" />,
      color: "blue-400",
      bgGradient: "from-blue-500 to-blue-600",
    },
    {
      key: "successRate",
      title: "Success Rate",
      getValue: (stats) => stats.totalSessions > 0 ? `${Math.round((stats.completedSessions / stats.totalSessions) * 100)}%` : "0%",
      getSubtitle: () => "completion rate",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "blue-400",
      bgGradient: "from-blue-600 to-blue-700",
    }
  ], []);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-stats-preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) {
          setSelectedStatKeys(parsed);
          return;
        }
      } catch (e) {
        console.log('Error parsing saved preferences');
      }
    }
    // Default selection
    setSelectedStatKeys(['totalSessions', 'learningHours', 'skillsToTeach', 'coursesLearning']);
  }, []);

  // Save preferences to localStorage
  const handleSelectionChange = (newSelection: string[]) => {
    setSelectedStatKeys(newSelection);
    localStorage.setItem('dashboard-stats-preferences', JSON.stringify(newSelection));
  };

  // Get the selected stats to display
  const displayedStats = useMemo(() => {
    return selectedStatKeys
      .map(key => allStatDefinitions.find(stat => stat.key === key))
      .filter(Boolean) as StatDefinition[];
  }, [selectedStatKeys, allStatDefinitions]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.fromTo(
      container,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Stats Overview</h2>
            <p className="text-gray-600">Track your learning journey and progress</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsCustomizing(true)}
            className="flex items-center gap-2 hover:bg-indigo-50 hover:border-indigo-200"
          >
            <Settings className="h-4 w-4" />
            Customize
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {displayedStats.map((stat, index) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stat.getValue(stats)}
            subtitle={stat.getSubtitle(stats)}
            icon={stat.icon}
            color={stat.color}
            bgGradient={stat.bgGradient}
            delay={index}
          />
        ))}
      </div>

      <StatsCustomizationModal
        isOpen={isCustomizing}
        onClose={() => setIsCustomizing(false)}
        availableStats={allStatDefinitions}
        selectedStats={selectedStatKeys}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};