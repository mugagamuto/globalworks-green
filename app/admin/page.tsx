"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { Toast } from "@/components/Toast";
import { supabase } from "@/lib/supabase/client";
import type { Job, VisaInquiry, Profile } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [inquiries, setInquiries] = useState<VisaInquiry[]>([]);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [salary, setSalary] = useState("");
  const [requirements, setRequirements] = useState("");
  const canCreate = useMemo(() => title.trim().length >= 3, [title]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user;
      if (!user) { router.replace("/login"); return; }

      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      const prof = p as Profile | null;
      const isAdmin = !!prof?.is_admin;

      if (!alive) return;
      setAllowed(isAdmin);

      if (!isAdmin) { setLoading(false); return; }

      const { data: j } = await supabase.from("jobs").select("*").order("created_at", { ascending: false }).limit(50);
      const { data: v } = await supabase.from("visa_inquiries").select("*").order("created_at", { ascending: false }).limit(50);

      if (!alive) return;
      setJobs((j as Job[]) ?? []);
      setInquiries((v as VisaInquiry[]) ?? []);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [router]);

  async function createJob() {
    if (!canCreate) { setToast("Please enter a job title."); return; }
    setToast(null);

    const { error } = await supabase.from("jobs").insert({
      title: title.trim(),
      country: country.trim() || null,
      salary_range: salary.trim() || null,
      requirements: requirements.trim() || null,
      is_active: true,
    });

    if (error) { setToast(error.message); return; }

    setTitle(""); setCountry(""); setSalary(""); setRequirements("");
    const { data: j } = await supabase.from("jobs").select("*").order("created_at", { ascending: false }).limit(50);
    setJobs((j as Job[]) ?? []);
    setToast("Job created.");
  }

  async function updateInquiryStatus(id: string, status: string) {
    const { error } = await supabase.from("visa_inquiries").update({ status }).eq("id", id);
    if (error) { setToast(error.message); return; }
    setInquiries((prev) => prev.map(i => i.id === id ? { ...i, status } : i));
  }

  if (loading) {
    return <Container className="py-14"><div className="rounded-2xl border border-brand-100 bg-white p-6 text-sm text-gray-600">Loading admin...</div></Container>;
  }

  if (!allowed) {
    return (
      <Container className="py-14">
        <SectionHeader badge="Admin" title="Admin access required" subtitle="Set profiles.is_admin = true for your user." />
        <div className="mt-8 rounded-2xl border border-brand-100 bg-white p-6 text-sm text-gray-700 shadow-sm">
          You are logged in, but your account is not marked as admin.
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <SectionHeader badge="Admin" title="Manage jobs & inquiries" subtitle="Create jobs and handle visa inquiries." />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="text-sm font-semibold text-gray-900">Create job</div>
          <div className="mt-4 grid gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="Caregiver / Mason / Driver..." />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Country</label>
              <input value={country} onChange={(e) => setCountry(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="UK" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Salary range</label>
              <input value={salary} onChange={(e) => setSalary(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="£2,000 - £2,800" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Requirements</label>
              <textarea value={requirements} onChange={(e) => setRequirements(e.target.value)}
                className="mt-1 min-h-[110px] w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="Experience, certificates, language, etc." />
            </div>
            <Button onClick={createJob}>Create</Button>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="text-sm font-semibold text-gray-900">Recent visa inquiries</div>
          <div className="mt-5 grid gap-3">
            {inquiries.length ? inquiries.map((i) => (
              <div key={i.id} className="rounded-2xl border border-brand-100 bg-white p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{i.full_name} — {i.visa_type}</div>
                    <div className="mt-1 text-xs text-gray-600">{i.email}{i.phone ? ` • ${i.phone}` : ""}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">{i.status}</span>
                    <Button variant="secondary" onClick={() => updateInquiryStatus(i.id, "in_review")}>In review</Button>
                    <Button variant="ghost" onClick={() => updateInquiryStatus(i.id, "resolved")}>Resolved</Button>
                  </div>
                </div>
                {i.message ? <p className="mt-3 text-sm text-gray-600">{i.message}</p> : null}
              </div>
            )) : <div className="rounded-2xl border border-brand-100 bg-white p-6 text-sm text-gray-600">No inquiries yet.</div>}
          </div>

          <div className="mt-8 text-sm font-semibold text-gray-900">Recent jobs</div>
          <div className="mt-4 grid gap-3">
            {jobs.length ? jobs.map((j) => (
              <div key={j.id} className="rounded-2xl border border-brand-100 bg-white p-5">
                <div className="text-sm font-semibold text-gray-900">{j.title}</div>
                <div className="mt-1 text-xs text-gray-600">{j.country || "—"} • {j.salary_range || "Salary negotiable"}</div>
              </div>
            )) : <div className="rounded-2xl border border-brand-100 bg-white p-6 text-sm text-gray-600">No jobs yet.</div>}
          </div>
        </Card>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </Container>
  );
}
