"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [dob, setDob] = useState("");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onRegister(e: React.FormEvent) {
    e.preventDefault();
    if (pw1 !== pw2) return alert("Passwords do not match");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email, password: pw1,
        firstName, lastName,
        dateOfBirth: dob || undefined,
      }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Could not register");

    const s = await signIn("credentials", { 
      email, 
      password: pw1, 
      redirect: false, 
      callbackUrl: "/onboarding" 
    });
    if (s?.ok) router.push("/onboarding");
    else router.push("/signin");
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
            <h2 className="text-3xl font-bold text-white">Join Swap</h2>
            <p className="mt-2 text-slate-300">Start exchanging skills and knowledge</p>
          </div>
        </div>

        <form onSubmit={onRegister} className="space-y-5">
          <div className="space-y-4">
            <Input
              placeholder="your-email@student.university.edu"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl h-12"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirst(e.target.value)}
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl h-12"
              />
              <Input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLast(e.target.value)}
                className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl h-12"
              />
            </div>
            <Input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl h-12"
            />
            <Input
              type="password"
              placeholder="Create a secure password (min 8 characters)"
              value={pw1}
              onChange={(e) => setPw1(e.target.value)}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-cyan-500/20 rounded-xl h-12"
            />
            <Input
              type="password"
              placeholder="Confirm your password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
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
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
          </button>
        </form>

        <p className="text-center text-slate-400">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}