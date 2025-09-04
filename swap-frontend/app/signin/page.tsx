"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Do NOT auto-redirect; we’ll push using the returned URL so it works reliably
    const res = await signIn("credentials", {
      email,
      password: pwd,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);

    if (res && !res.error) {
      router.replace(res.url ?? callbackUrl);
    } else {
      alert(res?.error || "Invalid email or password");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* SSO */}
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold">Sign in</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full sm:w-auto"
          >
            Continue with Google
          </Button>
          <Button
            onClick={() => signIn("azure-ad", { callbackUrl })}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Continue with Microsoft
          </Button>
        </div>
      </div>

      {/* Email login */}
      <div className="rounded-2xl bg-white p-6 shadow-soft" id="email-login">
        <h3 className="mb-3 text-sm font-semibold">Or log in with email</h3>
        <form onSubmit={onLogin} className="flex flex-col gap-3 max-w-sm">
          <Input
            type="email"
            placeholder="you@aui.ma"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Log in"}
          </Button>
        </form>
        <p className="mt-3 text-xs text-gray-600">
          New here?{" "}
          <a
            className="text-indigo-600 underline"
            href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
