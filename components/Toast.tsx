"use client";

import React, { useEffect } from "react";

export function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="rounded-2xl border border-brand-100 bg-white px-4 py-3 text-sm text-gray-800 shadow-lg">
        {message}
      </div>
    </div>
  );
}
