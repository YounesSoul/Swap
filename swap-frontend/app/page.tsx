"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();
  const { status } = useSession();

  const toCreateAccount = () =>
    router.push(`/register?callbackUrl=${encodeURIComponent("/onboarding")}`);

  const toLogin = () =>
    router.push(
      `/signin?mode=email&callbackUrl=${encodeURIComponent(
        "/dashboard",
      )}#email-login`,
    );

  const toDashboard = () => router.push("/dashboard");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-3xl bg-[#0f1729] p-8 text-white shadow-xl">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          {/* Left: headline + CTAs */}
          <div>
            <h1 className="text-4xl font-extrabold leading-tight">
              Swap — trade your skills
              <br className="hidden sm:block" /> for time
            </h1>

            <p className="mt-3 max-w-xl text-white/80">
              Students help each other. 1 hour you teach = 1 token you can use
              anywhere.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {status === "authenticated" ? (
                <Button
                  onClick={toDashboard}
                  className="bg-white text-black hover:bg-white/90"
                >
                  Go to dashboard
                </Button>
              ) : (
                <>
                  {/* Primary: Create account (goes straight to register) */}
                  <Button
                    onClick={toCreateAccount}
                    className="bg-white text-black hover:bg-white/90"
                  >
                    Create account
                  </Button>

                  {/* Secondary: Log in (email/password form) */}
                  <Button
                    variant="outline"
                    onClick={toLogin}
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                  >
                    Log in
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right: feature bullets in a soft card */}
          <div className="rounded-2xl bg-white/5 p-6">
            <ul className="space-y-3 text-sm text-white/85">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-white/70" />
                <span>Find peers teaching what you want</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-white/70" />
                <span>Send requests and schedule 1:1 sessions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-white/70" />
                <span>Earn tokens by teaching — spend them anywhere</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-white/70" />
                <span>Student-only access; campus-verified email required</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
