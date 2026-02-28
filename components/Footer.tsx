import React from "react";
import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white">
      <Container className="py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-sm font-extrabold">GlobalWorks</div>
            <p className="mt-2 text-sm text-gray-600">
              A green, modern recruitment & visa inquiry platform starter. Customize it to match your brand.
            </p>
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-900">Pages</div>
            <div className="mt-3 grid gap-2 text-gray-700">
              <Link href="/jobs" className="hover:text-brand-700">Jobs</Link>
              <Link href="/visas" className="hover:text-brand-700">Visas</Link>
              <Link href="/destinations" className="hover:text-brand-700">Destinations</Link>
              <Link href="/how-it-works" className="hover:text-brand-700">How it works</Link>
            </div>
          </div>
          <div className="text-sm">
            <div className="font-semibold text-gray-900">Support</div>
            <div className="mt-3 grid gap-2 text-gray-700">
              <Link href="/contact" className="hover:text-brand-700">Contact</Link>
              <Link href="/about" className="hover:text-brand-700">About</Link>
              <Link href="/dashboard" className="hover:text-brand-700">Dashboard</Link>
              <Link href="/admin" className="hover:text-brand-700">Admin</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-brand-100 pt-6 text-xs text-gray-500 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} GlobalWorks. All rights reserved.</div>
          <div className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
