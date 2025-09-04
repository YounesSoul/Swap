"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSwap } from "@/lib/store";

/** Seeds the store whenever the signed-in email changes */
export default function AuthBootstrap() {
  const { data, status } = useSession();
  const email = data?.user?.email || "";
  const seededFor = useRef<string>("");

  useEffect(() => {
    if (status !== "authenticated" || !email) return;
    if (seededFor.current === email) return; // prevent duplicate calls
    seededFor.current = email;
    useSwap.getState().seed(email);
  }, [status, email]);

  return null;
}
