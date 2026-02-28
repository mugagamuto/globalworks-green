import React from "react";
import { Badge } from "./Badge";

export function SectionHeader({ badge, title, subtitle }: { badge?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl">
      {badge ? <Badge>{badge}</Badge> : null}
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 md:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm text-gray-600 md:text-base">{subtitle}</p> : null}
    </div>
  );
}
