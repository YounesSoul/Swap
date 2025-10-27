
"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSwap } from "@/lib/store";
import { upsertUser } from "@/lib/api";

export default function BootstrapProfile(){
  const {data:session}=useSession();
  const setMe=useSwap(s=>s.setMe);
  const seed=useSwap(s=>s.seed);
  useEffect(()=>{(async()=>{
    if (session?.user?.email) {
      const { email, name, image } = session.user;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Upsert user and get the actual user ID from the response
      const result = await upsertUser({ 
        email, 
        name: name || undefined, 
        timezone, 
        image: image || undefined 
      });
      
      if (result.ok && result.data) {
        setMe({
          id: result.data.id, // Use the actual UUID from the database
          name: name || '',
          email,
          timezone,
          image: image || undefined,
        });
      } else {
        // Fallback if upsert fails
        setMe({ 
          id: "me", 
          name: name || '', 
          email, 
          timezone, 
          image: image || undefined 
        });
      }
    }
  })();},[session,setMe,seed]);
  return null;
}
