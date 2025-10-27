"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Nav";

export default function ConditionalNav() {
  const pathname = usePathname();

  // Hide the old Navigation on the landing page (root)
  if (pathname === "/") return null;

  return <Navigation />;
}
