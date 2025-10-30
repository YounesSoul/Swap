"use client";
import { useEffect } from "react";
import { useSupabaseAuth } from "@/components/SupabaseAuthProvider";
import { useSwap } from "@/lib/store";
import { upsertUser } from "@/lib/api";

export default function BootstrapProfile() {
  const { user } = useSupabaseAuth();
  const setMe = useSwap(s => s.setMe);
  const seed = useSwap(s => s.seed);

  useEffect(() => {
    (async () => {
      if (user?.email) {
        const email = user.email;
        const name = user.user_metadata?.full_name || user.email.split('@')[0];
        const image = user.user_metadata?.avatar_url;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Upsert user and get the actual user ID from the response
        const result = await upsertUser({
          email,
          name,
          timezone,
          image,
        });

        if (result.ok && result.data) {
          setMe({
            id: result.data.id, // Use the actual UUID from the database
            name: name || '',
            email,
            timezone,
            image,
          });
          // Seed the store with user data
          await seed(email);
        } else {
          // Fallback if upsert fails
          setMe({
            id: user.id, // Use Supabase auth user ID
            name: name || '',
            email,
            timezone,
            image,
          });
          // Still try to seed even if upsert failed
          await seed(email);
        }
      }
    })();
  }, [user, setMe, seed]);

  return null;
}
