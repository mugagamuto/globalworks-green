import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ href, variant = "primary", className, children, ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? "bg-brand-600 text-white hover:bg-brand-700 shadow-soft"
      : variant === "secondary"
      ? "bg-brand-50 text-brand-800 hover:bg-brand-100 border border-brand-100"
      : "bg-transparent text-brand-800 hover:bg-brand-50";

  if (href) {
    return (
      <Link href={href} className={cn(base, styles, className)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn(base, styles, className)} {...props}>
      {children}
    </button>
  );
}
