"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { SectionHeader } from "@/components/SectionHeader";
import { supabase } from "@/lib/supabase/client";
import type { Profile, VisaInquiry } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [inquiries, setInquiries] = useState<VisaInquiry[]>([]);
  const router = useRouter();

  const greeting = useMemo(() => {
    const n = profile?.full_name?.trim();
    return n ? `Welcome, ${n}` : "Welcome";
  }, [profile]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: s } = await supabase.auth.getSession();
      const user = s.session?.user;
      if (!user) { router.replace("/login"); return; }

      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (alive) setProfile((p as Profile) ?? null);

      const { data: v } = await supabase.from("visa_inquiries").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
      if (alive) setInquiries((v as VisaInquiry[]) ?? []);
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, [router]);

  if (loading) {
    return <Container className="py-14"><div className="rounded-2xl border border-brand-100 bg-white p-6 text-sm text-gray-600">Loading dashboard...</div></Container>;
  }

  return (
    <Container className="py-14">
      <SectionHeader badge="Dashboard" title={greeting} subtitle="Track your visa inquiries and job applications." />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="text-sm font-semibold text-gray-900">Quick actions</div>
          <div className="mt-4 grid gap-2">
            <Button href="/jobs" variant="secondary">Browse jobs</Button>
            <Button href="/visas">Send visa inquiry</Button>
            <Button href="/admin" variant="ghost">Admin (if allowed)</Button>
          </div>

          <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50/40 p-4 text-sm text-gray-700">
            <div className="font-semibold">Your profile</div>
            <div className="mt-2 text-xs text-gray-600">Country</div>
            <div className="text-sm">{profile?.country || "—"}</div>
            <div className="mt-3 text-xs text-gray-600">Phone</div>
            <div className="text-sm">{profile?.phone || "—"}</div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">Visa inquiries</div>
            <Link href="/visas" className="text-sm font-semibold text-brand-700 hover:underline">New inquiry</Link>
          </div>

          <div className="mt-5 grid gap-3">
            {inquiries.length ? inquiries.map((i) => (
              <div key={i.id} className="rounded-2xl border border-brand-100 bg-white p-5">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{i.visa_type} Visa</div>
                    <div className="mt-1 text-xs text-gray-600">{i.destination ? `${i.destination} • ` : ""}{new Date(i.created_at).toLocaleString()}</div>
                  </div>
                  <div className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">{i.status}</div>
                </div>
                {i.message ? <p className="mt-3 text-sm text-gray-600">{i.message}</p> : null}
              </div>
            )) : (
              <div className="rounded-2xl border border-brand-100 bg-white p-6 text-sm text-gray-600">No inquiries yet.</div>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
}
