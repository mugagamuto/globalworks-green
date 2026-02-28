"use client";

import React, { useState } from "react";
import { Container } from "@/components/Container";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Toast } from "@/components/Toast";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setToast(null);
    setBusy(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setBusy(false);
    if (error) { setToast(error.message); return; }
    router.push("/dashboard");
  }

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-md">
        <Card>
          <div className="text-xl font-extrabold text-gray-900">Welcome back</div>
          <p className="mt-2 text-sm text-gray-600">Login to access your dashboard.</p>

          <form onSubmit={submit} className="mt-6 grid gap-3">
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
                placeholder="••••••••" required />
            </div>

            <Button className="w-full" disabled={busy}>{busy ? "Logging in..." : "Login"}</Button>

            <div className="text-center text-sm text-gray-600">
              No account? <Link href="/register" className="font-semibold text-brand-700 hover:underline">Create one</Link>
            </div>
          </form>
        </Card>
      </div>

      <Toast message={toast} onClose={() => setToast(null)} />
    </Container>
  );
}
