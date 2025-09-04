
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
    if(session?.user?.email){
      const email=session.user.email; const name=session.user.name||email.split("@")[0];
      const timezone=Intl.DateTimeFormat().resolvedOptions().timeZone;
      const image=(session.user as any).image as string | undefined;
      setMe({id:"me",name,email,timezone,image});
      await upsertUser({email,name,timezone,image});
      await seed(email);
    }
  })();},[session,setMe,seed]);
  return null;
}
