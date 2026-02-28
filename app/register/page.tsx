"use client";

import React, { useState } from "react";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Toast } from "@/components/Toast";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setToast(null);
    setBusy(true);

    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({ email: cleanEmail, password });

    if (error) { setBusy(false); setToast(error.message); return; }

    const userId = data.user?.id;
    if (userId) {
      await supabase.from("profiles").upsert({
        id: userId,
        full_name: fullName.trim() || null,
        country: country.trim() || null,
        phone: phone.trim() || null,
        is_admin: false,
      });
    }

    setBusy(false);
    router.push("/dashboard");
  }

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-md">
        <Card>
          <div className="text-xl font-extrabold text-gray-900">Create your account</div>
          <p className="mt-2 text-sm text-gray-600">Start applying and tracking your progress.</p>

          <form onSubmit={submit} className="mt-6 grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-gray-700">Full name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                  placeholder="Your name" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700">Country</label>
                <input value={country} onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                  placeholder="Uganda" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Phone (optional)</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="+256..." />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="you@email.com" required />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password"
                className="mt-1 w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
                placeholder="Minimum 6 characters" minLength={6} required />
            </div>

            <Button className="w-full" disabled={busy}>{busy ? "Creating..." : "Create account"}</Button>

            <div className="text-center text-sm text-gray-600">
              Already have an account? <Link href="/login" className="font-semibold text-brand-700 hover:underline">Login</Link>
            </div>
          </form>
        </Card>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </Container>
  );
}
