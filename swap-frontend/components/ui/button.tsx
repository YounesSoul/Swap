
import * as React from "react"; import { cn } from "@/lib/utils";
type Props=React.ButtonHTMLAttributes<HTMLButtonElement>&{variant?:"primary"|"outline"|"ghost"};
export const Button=React.forwardRef<HTMLButtonElement,Props>(({className,variant="primary",...p},ref)=>(
<button ref={ref} className={cn("rounded-2xl px-4 py-2 text-sm font-medium shadow-soft",
 variant==="primary"&&"bg-gray-900 text-white hover:opacity-90",
 variant==="outline"&&"border border-gray-300 bg-white hover:bg-gray-50",
 variant==="ghost"&&"bg-transparent hover:bg-gray-100", className)} {...p}/>));
Button.displayName="Button";
