"use client";

import React, { useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Toast } from "@/components/Toast";
import { supabase } from "@/lib/supabase/client";

const visaTypes = ["Tourist", "Work", "Student", "Family", "Business"];

export default function VisasPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [visaType, setVisaType] = useState("Work");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const canSend = useMemo(() => fullName.trim().length >= 2 && email.includes("@"), [fullName, email]);

  async function submit() {
    if (!canSend) { setToast("Please fill name and a valid email."); return; }
    setSending(true);
    setToast(null);

    const { data: s } = await supabase.auth.getSession();
    const userId = s.session?.user?.id ?? null;

    const { error } = await supabase.from("visa_inquiries").insert({
      user_id: userId,
      full_name: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || null,
      visa_type: visaType,
      destination: destination.trim() || null,
      message: message.trim() || null,
      status: "new",
    });

    setSending(false);

    if (error) { setToast(error.message); return; }

    setFullName(""); setEmail(""); setPhone(""); setDestination(""); setVisaType("Work"); setMessage("");
    setToast("Submitted! We will contact you soon.");
  }

  return (
    <Container className="py-14">
      <SectionHeader badge="Visas" title="Visa inquiry" subtitle="Send your details and our team will guide you." />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <div className="text-sm font-semibold text-gray-900">Visa types</div>
          <div className="mt-4 grid gap-2">
            {visaTypes.map((t) => (
              <button
                key={t}
                onClick={() => setVisaType(t)}
                className={[
                  "rounded-xl border px-4 py-3 text-left text-sm font-semibold transition",
                  t === visaType ? "border-brand-200 bg-brand-50 text-brand-800" : "border-brand-100 bg-white text-gray-700 hover:bg-brand-50",
                ].join(" ")}
              >
                {t} Visa
              </button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="text-sm font-semibold text-gray-900">Inquiry form</div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-gray-700">Full name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Phone (optional)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="+256..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700">Destination (optional)</label>
              <input value={destination} onChange={(e) => setDestination(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="United Kingdom"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700">Message (optional)</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                className="mt-1 min-h-[120px] w-full rounded-xl border border-brand-100 bg-white px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="Tell us your situation..."
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-gray-500">By submitting, you agree to be contacted about your inquiry.</div>
            <Button onClick={submit} disabled={sending}>{sending ? "Submitting..." : "Submit inquiry"}</Button>
          </div>
        </Card>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </Container>
  );
}
