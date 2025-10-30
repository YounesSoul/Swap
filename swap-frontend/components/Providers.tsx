"use client";
import { SupabaseAuthProvider } from "./SupabaseAuthProvider";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      {children}
      <Toaster position="top-right" richColors closeButton />
    </SupabaseAuthProvider>
  );
}
