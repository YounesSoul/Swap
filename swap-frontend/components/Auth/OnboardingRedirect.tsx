"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSwap } from "@/lib/store";

/** Redirects to /onboarding if the user isn't onboarded yet */
export default function OnboardingRedirect() {
  const { status } = useSession();
  const onboarded = useSwap(s => s.onboarded);
  const pathname = usePathname();
  const router = useRouter();

  const isAuthRoute = pathname?.startsWith("/signin") || pathname === "/onboarding";

  useEffect(() => {
    if (status !== "authenticated") return;
    if (isAuthRoute) return;
    if (onboarded === false) {
      const next = pathname || "/dashboard";
      router.replace(`/onboarding?next=${encodeURIComponent(next)}`);
    }
  }, [status, onboarded, isAuthRoute, pathname, router]);

  return null;
}
