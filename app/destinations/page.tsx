"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";
import { supabase } from "@/lib/supabase/client";
import type { Destination } from "@/lib/types";

const fallback: Destination[] = [
  { id: "1", name: "United Kingdom", slug: "uk", highlights: "NHS roles, construction, hospitality", image_url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80" },
  { id: "2", name: "Canada", slug: "canada", highlights: "Skilled workers, care-giving pathways", image_url: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80" },
  { id: "3", name: "UAE", slug: "uae", highlights: "Fast hiring cycles, logistics & hospitality", image_url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80" },
];

export default function DestinationsPage() {
  const [items, setItems] = useState<Destination[]>(fallback);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await supabase.from("destinations").select("*").order("name").limit(50);
      if (!alive) return;
      if (!error && data?.length) setItems(data as Destination[]);
    })();
    return () => { alive = false; };
  }, []);

  return (
    <Container className="py-14">
      <SectionHeader badge="Explore" title="Destinations" subtitle="Browse popular countries and what to expect." />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((d) => (
          <Card key={d.id} className="overflow-hidden p-0">
            <div className="relative h-40 w-full">
              <Image
                src={d.image_url || "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1200&q=80"}
                alt={d.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <div className="text-sm font-semibold text-gray-900">{d.name}</div>
              <p className="mt-2 text-sm text-gray-600">{d.highlights || "Visa routes, jobs, and requirements overview."}</p>
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}
