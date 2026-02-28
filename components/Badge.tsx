import React from "react";
import { cn } from "@/lib/utils";

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800", className)}>
      {children}
    </span>
  );
}
