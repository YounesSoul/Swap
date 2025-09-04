
import * as React from "react"; import { cn } from "@/lib/utils";
export const Input=React.forwardRef<HTMLInputElement,React.InputHTMLAttributes<HTMLInputElement>>(({className,...p},ref)=>(
<input ref={ref} className={cn("w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/10",className)} {...p}/>));
Input.displayName="Input";
