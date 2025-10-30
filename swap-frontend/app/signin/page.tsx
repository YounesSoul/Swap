"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/dashboard";

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pwd,
    });

    setLoading(false);

    if (error) {
      alert(error.message || "Invalid email or password");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  async function onOAuthSignIn(provider: 'google' | 'azure') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider === 'azure' ? 'azure' : 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}`,
      },
    });

    if (error) {
      alert(error.message);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute right-[-15%] top-32 h-96 w-96 rounded-full bg-gradient-to-l from-violet-500/15 to-purple-600/15 blur-3xl animate-pulse delay-1000" />
      
      <div className="relative w-full max-w-md space-y-8 rounded-3xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-8 backdrop-blur-xl border border-slate-600/50 shadow-2xl">
        {/* Background glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 blur-xl -z-10"></div>
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
            <Image
              src="/images/swap-logo.svg"
              alt="SWAP"
              width={32}
              height={32}
              className="text-white"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="mt-2 text-slate-300">Continue your learning journey</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* SSO Buttons */}
          <div className="grid gap-3">
            <button 
              onClick={() => onOAuthSignIn('google')}
              className="flex w-full items-center justify-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white hover:bg-slate-700/50 transition-all duration-300 hover:border-slate-500"
            >
              <Image src="/images/google-logo.svg" alt="Google" width={20} height={20} />
              Continue with Google
            </button>
            <button 
              onClick={() => onOAuthSignIn('azure')}
              className="flex w-full items-center justify-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-600/50 text-white hover:bg-slate-700/50 transition-all duration-300 hover:border-slate-500"
            >
              <Image src="/images/microsoft-logo.svg" alt="Microsoft" width={20} height={20} />
              Continue with Microsoft
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600/50"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 px-4 text-slate-400">Or continue with email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={onLogin} className="space-y-5">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="your-email@student.university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl h-12"
              />
              <Input
                type="password"
                placeholder="Enter your password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl h-12"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400">
          New to Swap?{" "}
          <Link 
            href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}