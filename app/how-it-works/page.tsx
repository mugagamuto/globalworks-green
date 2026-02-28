import React from "react";
import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";

export default function Page() {
  return (
    <Container className="py-14">
      <SectionHeader
        badge="GlobalWorks"
        title="How it works"
        subtitle="A clear step-by-step flow (signup → apply → track)."
      />
      <div className="mt-8 rounded-2xl border border-brand-100 bg-white p-6 text-sm text-gray-700 shadow-sm">
        <p>This is a starter page. Replace this section with your real content.</p>
      </div>
    </Container>
  );
}
