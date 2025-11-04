import { useEffect, useRef } from "react";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import { useSwap } from "@/lib/store";
import { upsertUser } from "@/lib/api";

const BootstrapProfile = () => {
  const { user } = useSupabaseAuth();
  const setMe = useSwap((state) => state.setMe);
  const seed = useSwap((state) => state.seed);
  const seededEmailRef = useRef<string | null>(null);

  useEffect(() => {
    const hydrate = async () => {
      if (!user?.email) {
        seededEmailRef.current = null;
        return;
      }

      if (seededEmailRef.current === user.email) {
        return;
      }

      seededEmailRef.current = user.email;

      const email = user.email;
      const name = user.user_metadata?.full_name || email.split("@")[0];
      const image = user.user_metadata?.avatar_url;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      try {
        console.log("[BootstrapProfile] Starting upsert for:", email);
        const result = await upsertUser({
          email,
          name,
          timezone,
          image,
        });

        console.log("[BootstrapProfile] Upsert result:", result);

        // Always set me - Zustand updates are safe even if component unmounts
        if (result.ok && result.data) {
          console.log("[BootstrapProfile] Setting me with DB data:", result.data);
          setMe({
            id: result.data.id,
            name: name ?? "",
            email,
            timezone,
            image,
          });
        } else {
          console.log("[BootstrapProfile] Upsert failed, using fallback with Supabase ID");
          setMe({
            id: user.id,
            name: name ?? "",
            email,
            timezone,
            image,
          });
        }

        // Seed is also safe to run even if component unmounts
        // The store update happens regardless of component lifecycle
        console.log("[BootstrapProfile] Starting seed");
        await seed(email);
        console.log("[BootstrapProfile] Seed complete");
      } catch (error) {
        console.error("[BootstrapProfile] Failed to bootstrap profile", error);
        // Still try to seed on error
        await seed(email);
      }
    };

    hydrate();
  }, [seed, setMe, user]);

  return null;
};

export default BootstrapProfile;
