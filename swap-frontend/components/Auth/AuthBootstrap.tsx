"use client";
import { useEffect, useRef } from "react";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";
import { useSwap } from "@/lib/store";

/** Seeds the store whenever the signed-in email changes */
export default function AuthBootstrap() {
  const { user, loading } = useSupabaseAuth();
  const email = user?.email || "";
  const seededFor = useRef<string>("");

  useEffect(() => {
    if (loading || !user || !email) return;
    if (seededFor.current === email) return; // prevent duplicate calls
    seededFor.current = email;
    useSwap.getState().seed(email);
  }, [user, loading, email]);

  return null;
}
