"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [dob, setDob] = useState(""); // yyyy-mm-dd
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

    // auto-login
    const s = await signIn("credentials", { email, password: pw1, redirect: false, callbackUrl: "/onboarding" });
    if (s?.ok) router.push("/onboarding");
    else router.push("/signin");
  }

  return (
    <div className="max-w-md rounded-2xl bg-white p-6 shadow-soft">
      <h2 className="mb-4 text-lg font-semibold">Create your account</h2>
      <form onSubmit={onRegister} className="grid gap-3">
        <Input placeholder="you@aui.ma" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input placeholder="First name" value={firstName} onChange={(e)=>setFirst(e.target.value)} />
          <Input placeholder="Last name" value={lastName} onChange={(e)=>setLast(e.target.value)} />
        </div>
        <Input type="date" value={dob} onChange={(e)=>setDob(e.target.value)} />
        <Input type="password" placeholder="Password (min 8)" value={pw1} onChange={(e)=>setPw1(e.target.value)} />
        <Input type="password" placeholder="Confirm password" value={pw2} onChange={(e)=>setPw2(e.target.value)} />
        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
      </form>
      <p className="mt-3 text-xs text-gray-600">
        Prefer SSO? <a className="text-indigo-600 underline" href="/signin">Sign in with Google/Microsoft</a>
      </p>
    </div>
  );
}
