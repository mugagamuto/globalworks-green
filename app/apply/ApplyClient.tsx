"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";
import { Toast } from "@/components/Toast";

export default function ApplyClient() {
  const sp = useSearchParams();
  const jobId = sp.get("jobId");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState<string>("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return !!jobId && name.trim().length >= 2 && email.includes("@") && !!file;
  }, [jobId, name, email, file]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session?.user) {
        router.replace(`/login`);
        return;
      }

      if (jobId) {
        const { data } = await supabase.from("jobs").select("title").eq("id", jobId).single();
        if (alive) setJobTitle(data?.title || "");
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, [jobId, router]);

  async function submit() {
    if (!canSubmit || !file) {
      setToast("Fill name, email, and upload your CV.");
      return;
    }
    setBusy(true);
    setToast(null);

    const { data: s } = await supabase.auth.getSession();
    const user = s.session?.user;
    if (!user) {
      setBusy(false);
      router.replace("/login");
      return;
    }

    const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
    const path = `${user.id}/${jobId}/${Date.now()}.${ext}`;

    const up = await supabase.storage.from("cvs").upload(path, file, { upsert: false });
    if (up.error) {
      setBusy(false);
      setToast(up.error.message);
      return;
    }

    const { error } = await supabase.from("job_applications").insert({
      job_id: jobId,
      user_id: user.id,
      cv_url: path,
      stage: "new",
      applicant_name: name.trim(),
      applicant_email: email.trim().toLowerCase(),
      applicant_phone: phone.trim() || null,
      status: "new",
    });

    setBusy(false);
    if (error) {
      setToast(error.message);
      return;
    }

    setToast("Application submitted successfully!");
    setTimeout(() => router.push("/dashboard"), 900);
  }

  if (loading) {
    return (
      <Container className="py-14">
        <div className="rounded-2xl border border-brand-100 bg-white p-6 text-sm text-gray-600">Loading...</div>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <SectionHeader
        badge="Apply"
        title="Submit your application"
        subtitle={jobTitle ? `Job: ${jobTitle}` : "Choose a job from /jobs"}
      />

      <div className="mt-8 mx-auto max-w-xl">
        <Card>
          <div className="grid gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-700">Full name</label>
              <input
                className="mt-1 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Email</label>
              <input
                className="mt-1 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Phone (optional)</label>
              <input
                className="mt-1 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+256..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Upload CV</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="mt-1 w-full text-sm"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="mt-1 text-xs text-gray-500">Stored securely in Supabase Storage.</div>
            </div>

            <Button onClick={submit} disabled={busy || !canSubmit}>
              {busy ? "Submitting..." : "Submit application"}
            </Button>

            <Button href="/jobs" variant="secondary">Back to jobs</Button>
          </div>
        </Card>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </Container>
  );
}
