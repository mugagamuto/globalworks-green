import React from "react";
import Image from "next/image";
import { Container } from "@/components/Container";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { SectionHeader } from "@/components/SectionHeader";
import { Briefcase, Globe2, ShieldCheck, Sparkles } from "lucide-react";

const stats = [
  { label: "Destinations", value: "20+" },
  { label: "Job categories", value: "30+" },
  { label: "Support", value: "Fast" },
  { label: "Process", value: "Clear" },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-20 right-[-80px] h-72 w-72 rounded-full bg-brand-200 blur-3xl opacity-70" />
          <div className="absolute -bottom-24 left-[-90px] h-72 w-72 rounded-full bg-brand-100 blur-3xl opacity-70" />
        </div>

        <Container className="grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-800">
              <Sparkles size={16} /> Green, modern, fast-to-launch
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              Jobs abroad & visa support — in one clean platform.
            </h1>
            <p className="mt-4 text-base text-gray-600 md:text-lg">
              A professional website + member dashboard + admin panel to manage jobs, applications, and visa inquiries.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/register">Create account</Button>
              <Button href="/jobs" variant="secondary">Browse jobs</Button>
              <Button href="/visas" variant="ghost">Visa inquiry</Button>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
                  <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
                  <div className="mt-1 text-xs text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[28px] bg-brand-100 blur-2xl opacity-40" />
            <div className="overflow-hidden rounded-[28px] border border-brand-100 bg-white shadow-soft">
              <Image
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
                alt="Professional team"
                width={1200}
                height={800}
                className="h-[420px] w-full object-cover"
                priority
              />
              <div className="p-5">
                <div className="text-sm font-semibold text-gray-900">Your new global recruitment brand</div>
                <p className="mt-1 text-sm text-gray-600">
                  Green theme, strong typography, and clear calls-to-action — ready for Supabase.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-brand-100 bg-white">
        <Container className="py-14">
          <SectionHeader
            badge="Services"
            title="Everything you need to launch quickly"
            subtitle="Start with an MVP and expand as your business grows."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Card>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <Briefcase size={18} />
                </span>
                <div className="font-semibold">Jobs Board</div>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Categories, listings, application capture, CV upload, and status tracking.
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <Globe2 size={18} />
                </span>
                <div className="font-semibold">Destinations</div>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Country pages, highlights, requirements, and curated information.
              </p>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white">
                  <ShieldCheck size={18} />
                </span>
                <div className="font-semibold">Visa Inquiries</div>
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Inquiry forms + admin workflow (new → in review → resolved).
              </p>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
}
