import React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-2xl border border-brand-100 bg-white p-5 shadow-sm", className)}>{children}</div>;
}
