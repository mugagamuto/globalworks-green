"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Button } from "./Button";
import { supabase } from "@/lib/supabase/client";
import { Leaf, LogOut, LayoutDashboard } from "lucide-react";

export function Navbar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.session?.user.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-soft">
            <Leaf size={18} />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight">GlobalWorks</div>
            <div className="text-xs text-gray-500">Jobs • Visas • Destinations</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link className="text-sm text-gray-700 hover:text-brand-700" href="/jobs">Jobs</Link>
          <Link className="text-sm text-gray-700 hover:text-brand-700" href="/visas">Visas</Link>
          <Link className="text-sm text-gray-700 hover:text-brand-700" href="/destinations">Destinations</Link>
          <Link className="text-sm text-gray-700 hover:text-brand-700" href="/how-it-works">How it works</Link>
          <Link className="text-sm text-gray-700 hover:text-brand-700" href="/about">About</Link>
          <Link className="text-sm text-gray-700 hover:text-brand-700" href="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          {email ? (
            <>
              <Button href="/dashboard" variant="secondary" className="hidden sm:inline-flex">
                <LayoutDashboard size={16} className="mr-2" /> Dashboard
              </Button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border border-brand-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-brand-50"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <Button href="/login" variant="ghost" className="hidden sm:inline-flex">Login</Button>
              <Button href="/register">Create account</Button>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
