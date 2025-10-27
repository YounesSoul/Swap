import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import BootstrapProfile from "@/components/BootstrapProfile";
import AuthBootstrap from "@/components/Auth/AuthBootstrap";
import OnboardingRedirect from "@/components/Auth/OnboardingRedirect";
import ConditionalNav from "@/components/ConditionalNav";

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

          <div className="flex min-h-screen flex-col">
            <ConditionalNav />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
