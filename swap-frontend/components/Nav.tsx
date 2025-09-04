"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  BookOpen,
  User,
  MessageSquare,
  Calendar,
  Inbox,
  LogIn,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const items = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/matches", icon: Search, label: "Matches" },
  { href: "/courses", icon: BookOpen, label: "Courses" },
  { href: "/requests", icon: Inbox, label: "Requests" },
  { href: "/sessions", icon: Calendar, label: "Sessions" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthed = !!session;

  const createAccountHref = `/register?callbackUrl=${encodeURIComponent(
    "/onboarding"
  )}`;
  const loginHref = `/signin?mode=email&callbackUrl=${encodeURIComponent(
    "/dashboard"
  )}#email-login`;

  return (
    <aside className="hidden lg:block lg:w-64">
      <div className="sticky top-6 rounded-2xl bg-white p-3 shadow-soft">
        {/* Brand */}
        <Link
          href="/dashboard"
          className="mb-4 flex items-center gap-2 rounded-xl p-2 hover:bg-gray-50"
        >
          <img src="/logo.svg" className="h-8" alt="Swap" />
        </Link>

        {/* Main nav */}
        <nav className="space-y-1">
          {items.map(({ href, icon: Icon, label }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium hover:bg-gray-50",
                  active ? "bg-gray-900 text-white" : "text-gray-700"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Campus pill */}
        <div className="mt-4 rounded-xl border border-dashed p-3 text-xs text-gray-600">
          Campus: <b>AUI</b> • Beta
        </div>

        {/* CTA */}
        <Link
          href="/matches"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          Find a Swap
        </Link>

        {/* Auth actions */}
        <div className="mt-4">
          {!isAuthed ? (
            <div className="grid gap-2">
              {/* Primary: Create account */}
              <Link
                href={createAccountHref}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-900 bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                <LogIn className="h-4 w-4" />
                Create account
              </Link>

              {/* Secondary: Log in (email form) */}
              <Link
                href={loginHref}
                className="flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
            </div>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
