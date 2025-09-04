import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Providers from "@/components/Providers";
import Link from "next/link";
import BootstrapProfile from "@/components/BootstrapProfile";
import AuthBootstrap from "@/components/Auth/AuthBootstrap";
import OnboardingRedirect from "@/components/Auth/OnboardingRedirect";

export const metadata: Metadata = {
  title: "Swap — Student Skill Exchange",
  description: "Trade time-for-time tutoring.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {/* seed store + redirect to /onboarding when needed */}
          <AuthBootstrap />
          <OnboardingRedirect />
          <BootstrapProfile />

          <div className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-white p-3 shadow-soft lg:hidden">
              <Link href="/"><img src="/logo.svg" className="h-8" alt="Swap" /></Link>
              <div className="text-sm text-gray-600">Student-only beta</div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem,1fr]">
              <Nav />
              <main className="min-h-[70vh]">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
