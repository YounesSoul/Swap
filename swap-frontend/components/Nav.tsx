"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  User,
  MessageSquare,
  Calendar,
  Inbox,
  LogIn,
  LogOut,
  PlusCircle,
  Star,
} from "lucide-react";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";
import { NotificationBadge } from "@/components/ui/notification-badge";
import { useNotificationCounts } from "@/lib/useNotifications";

const items = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/matches", icon: PlusCircle, label: "Find a Swap" }, // Changed from Search/Matches
  { href: "/requests", icon: Inbox, label: "Requests" },
  { href: "/sessions", icon: Calendar, label: "Sessions" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/ratings", icon: Star, label: "Ratings" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { user, signOut } = useSupabaseAuth();
  const isAuthed = !!user;
  const notificationCounts = useNotificationCounts();

  // Debug logging
  console.log('Navigation - notificationCounts:', notificationCounts);
  console.log('Navigation - isAuthed:', isAuthed);

  const createAccountHref = `/register?callbackUrl=${encodeURIComponent(
    "/onboarding"
  )}`;
  const loginHref = `/signin?mode=email&callbackUrl=${encodeURIComponent(
    "/dashboard"
  )}#email-login`;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
            <img src="/images/swap-logo.svg" className="h-6 w-6" alt="Swap" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            SWAP
          </span>
        </Link>

        {/* Main Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthed && items.map(({ href, icon: Icon, label }) => {
            const active = pathname?.startsWith(href);
            
            // Get notification count for this specific item
            let notificationCount = 0;
            if (href === "/requests") {
              notificationCount = notificationCounts.requests;
            } else if (href === "/chat") {
              notificationCount = notificationCounts.chat;
            } else if (href === "/sessions") {
              notificationCount = notificationCounts.sessions;
            }
            
            // Temporary: Add a test count for dashboard to see if badge renders
            if (href === "/dashboard") {
              notificationCount = 2; // Test count
            }
            
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300",
                  active 
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white border border-cyan-500/30" 
                    : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:block">{label}</span>
                <NotificationBadge 
                  count={notificationCount}
                  className="absolute -top-1 -right-1"
                />
              </Link>
            );
          })}
        </div>

        {/* Right Section - Auth & Actions */}
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <>
              {/* Sign Out Button */}
              <button
                onClick={async () => {
                  await signOut();
                  window.location.href = '/';
                }}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:block">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                href={loginHref}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-300"
              >
                Sign In
              </Link>
              <Link
                href={createAccountHref}
                className="group relative flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-cyan-500/25 hover:-translate-y-0.5"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:block">Get Started</span>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}