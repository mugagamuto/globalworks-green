"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";

const STAGES = ["new", "shortlisted", "interview", "approved", "deployed", "rejected"] as const;

type Row = {
  id: string;
  created_at: string;
  stage: string;
  status: string | null;
  applicant_name: string | null;
  applicant_email: string | null;
  applicant_phone: string | null;
  cv_url: string | null;
  job_id: string;
};

export default function AdminApplicationsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (!error) setRows((data as Row[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStage(id: string, stage: string) {
    await supabase.from("job_applications").update({ stage, status: stage }).eq("id", id);
    load();
  }

  async function openCv(cvPath: string | null) {
    if (!cvPath) return;
    // Create a short-lived signed URL (private bucket)
    const { data, error } = await supabase.storage.from("cvs").createSignedUrl(cvPath, 60);
    if (error) return alert(error.message);
    window.open(data.signedUrl, "_blank");
  }

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const s of STAGES) m[s] = 0;
    for (const r of rows) m[r.stage] = (m[r.stage] || 0) + 1;
    return m;
  }, [rows]);

  return (
    <Container className="py-14">
      <SectionHeader
        badge="Admin"
        title="Applications CRM"
        subtitle="Move applicants through stages: new → shortlisted → interview → approved → deployed."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <div key={s} className="rounded-full border border-brand-100 bg-white px-3 py-1 text-xs font-semibold text-gray-700">
            {s}: {counts[s] || 0}
          </div>
        ))}
      </div>

      <Card className="mt-8">
        {loading ? (
          <div className="p-6 text-sm text-gray-600">Loading applications...</div>
        ) : rows.length ? (
          <div className="grid gap-3">
            {rows.map((r) => (
              <div key={r.id} className="rounded-2xl border border-brand-100 bg-white p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{r.applicant_name || "Applicant"}</div>
                    <div className="mt-1 text-xs text-gray-600">
                      {r.applicant_email || "—"} {r.applicant_phone ? `• ${r.applicant_phone}` : ""} • Stage:{" "}
                      <span className="font-semibold text-brand-800">{r.stage}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => openCv(r.cv_url)}>View CV</Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStage(r.id, s)}
                      className={
                        "rounded-full px-3 py-1 text-xs font-semibold border " +
                        (r.stage === s
                          ? "border-brand-300 bg-brand-100 text-brand-900"
                          : "border-brand-100 bg-white text-gray-700 hover:bg-brand-50")
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm text-gray-600">No applications yet.</div>
        )}
      </Card>
    </Container>
  );
}
