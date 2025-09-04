
import { cn } from '@/lib/utils';
export const Badge=({children,className}:{children:React.ReactNode;className?:string})=>(
  <span className={cn('inline-flex items-center rounded-xl border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs',className)}>{children}</span>
);
