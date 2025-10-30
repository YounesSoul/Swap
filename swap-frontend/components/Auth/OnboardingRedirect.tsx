"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";
import { useSwap } from "@/lib/store";

/** Redirects to /onboarding if the user isn't onboarded yet */
export default function OnboardingRedirect() {
  const { user, loading } = useSupabaseAuth();
  const onboarded = useSwap(s => s.onboarded);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthRoute = pathname?.startsWith("/signin") || pathname?.startsWith("/register") || pathname === "/onboarding";

  useEffect(() => {
    if (loading || !user) return;
    if (isAuthRoute) return;
    
    // Only redirect TO onboarding if NOT onboarded
    // Never redirect AWAY from any page based on onboarding status
    if (onboarded === false) {
      const next = pathname || "/dashboard";
      router.replace(`/onboarding?next=${encodeURIComponent(next)}`);
    }
  }, [user, loading, onboarded, isAuthRoute, pathname, router]);

  return null;
}
