import React, { Suspense } from "react";
import ApplyClient from "./ApplyClient";

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-600">Loading...</div>}>
      <ApplyClient />
    </Suspense>
  );
}
