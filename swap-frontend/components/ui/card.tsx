
import * as React from "react"; import { cn } from "@/lib/utils";
export function Card(p:React.HTMLAttributes<HTMLDivElement>){ return <div {...p} className={cn("rounded-2xl bg-white shadow-soft",p.className)}/>}
export function CardHeader(p:React.HTMLAttributes<HTMLDivElement>){ return <div {...p} className={cn("p-5 border-b border-gray-100",p.className)}/>}
export function CardContent(p:React.HTMLAttributes<HTMLDivElement>){ return <div {...p} className={cn("p-5",p.className)}/>}
export function CardTitle(p:React.HTMLAttributes<HTMLHeadingElement>){ return <h3 {...p} className={cn("text-base font-semibold",p.className)}/>}
