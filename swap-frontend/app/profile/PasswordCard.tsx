"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PasswordCard({ hasPassword }: { hasPassword?: boolean }) {
  const [current, setCurrent] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    if (pwd !== pwd2) return alert("Passwords do not match");
    setLoading(true);
    const res = await fetch("/api/account/set-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: pwd, currentPassword: current }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) return alert(data?.error || "Could not update password");
    setCurrent(""); setPwd(""); setPwd2("");
    alert("Password updated");
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-soft">
      <h3 className="mb-2 text-sm font-semibold">Password</h3>
      {hasPassword && (
        <Input type="password" placeholder="Current password" value={current} onChange={(e)=>setCurrent(e.target.value)} className="mb-2" />
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        <Input type="password" placeholder="New password" value={pwd} onChange={(e)=>setPwd(e.target.value)} />
        <Input type="password" placeholder="Confirm new password" value={pwd2} onChange={(e)=>setPwd2(e.target.value)} />
      </div>
      <Button className="mt-3" onClick={save} disabled={loading}>
        {loading ? "Saving..." : hasPassword ? "Change password" : "Set password"}
      </Button>
    </div>
  );
}
