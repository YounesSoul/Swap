import type { ReactNode } from "react";
import { SupabaseAuthProvider } from "@/providers/SupabaseAuthProvider";
import BootstrapProfile from "@/components/app/BootstrapProfile";

const SwapAppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SupabaseAuthProvider>
      <BootstrapProfile />
      {children}
    </SupabaseAuthProvider>
  );
};

export default SwapAppProviders;
