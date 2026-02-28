"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { supabase } from "@/lib/supabase/client";
import type { Job } from "@/lib/types";
import { Search } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(50);
      if (alive) setJobs((data as Job[]) ?? []);
    })();
    return () => { alive = false; };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return jobs;
    return jobs.filter(j =>
      (j.title || "").toLowerCase().includes(s) ||
      (j.country || "").toLowerCase().includes(s) ||
      (j.salary_range || "").toLowerCase().includes(s)
    );
  }, [jobs, q]);

  return (
    <Container className="py-14">
      <SectionHeader badge="Jobs" title="Find opportunities abroad" subtitle="Search and apply from your dashboard." />

      <Card className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold text-gray-900">Latest listings</div>
          <div className="flex items-center gap-2 rounded-xl border border-brand-100 bg-white px-3 py-2">
            <Search size={16} className="text-gray-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, country, salary..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {filtered.length ? filtered.map((j) => (
            <div key={j.id} className="rounded-2xl border border-brand-100 bg-white p-5 hover:bg-brand-50/40">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{j.title}</div>
                  <div className="mt-1 text-xs text-gray-600">
                    {j.country ? `${j.country} • ` : ""}{j.salary_range || "Salary negotiable"}
                  </div>
                </div>
                <Button href="/dashboard" variant="secondary">Apply</Button>
              </div>
              {j.requirements ? <p className="mt-3 text-sm text-gray-600">{j.requirements}</p> : null}
            </div>
          )) : (
            <div className="rounded-2xl border border-brand-100 bg-white p-6 text-sm text-gray-600">
              No jobs yet. Add jobs in the Admin panel.
            </div>
          )}
        </div>
      </Card>
    </Container>
  );
}
