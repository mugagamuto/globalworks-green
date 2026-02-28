"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";
import type { Job } from "@/lib/types";

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single();
      if (!alive) return;
      if (error) setJob(null);
      else setJob(data as Job);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [id]);

  const meta = useMemo(() => {
    if (!job) return [];
    return [
      ["Country", job.country || "—"],
      ["Salary", job.salary_range || "—"],
      ["Visa Type", (job as any).visa_type || "—"],
      ["Sponsorship", (job as any).sponsorship_available === false ? "No" : "Yes"],
      ["Contract", (job as any).contract_type || "—"],
      ["Experience", (job as any).experience_level || "—"],
    ] as const;
  }, [job]);

  if (loading) {
    return (
      <Container className="py-14">
        <div className="rounded-2xl border border-brand-100 bg-white p-6 text-sm text-gray-600">Loading job...</div>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container className="py-14">
        <SectionHeader badge="Jobs" title="Job not found" subtitle="This listing may have been removed." />
        <div className="mt-6">
          <Button href="/jobs" variant="secondary">Back to jobs</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <SectionHeader badge="Job" title={job.title} subtitle="Review details and apply." />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="text-sm font-semibold text-gray-900">Requirements</div>
          <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">
            {job.requirements || "No requirements provided yet."}
          </p>
        </Card>

        <Card className="lg:col-span-1">
          <div className="text-sm font-semibold text-gray-900">Overview</div>
          <div className="mt-4 grid gap-3">
            {meta.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-3">
                <div className="text-xs text-gray-500">{k}</div>
                <div className="text-sm font-semibold text-gray-900">{v}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-2">
            <Button onClick={() => router.push(`/apply?jobId=${job.id}`)}>Apply now</Button>
            <Button href="/jobs" variant="secondary">Browse more jobs</Button>
          </div>
        </Card>
      </div>
    </Container>
  );
}
