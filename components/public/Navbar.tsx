"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Mountain } from "lucide-react";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/fleet", label: "Fleet" },
  { href: "/guide", label: "Ooty Guide" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {/* Replace with image of Ooty Trails logo */}
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Mountain className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight">
            <span className="text-brand-600">Ooty</span>
            <span className="text-accent-500"> Trails</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:text-brand-700",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <a href={`tel:${SITE.phone}`} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Phone className="h-4 w-4 text-brand-500" />
            {SITE.phone}
          </a>
          <Link href="/book" className="btn-accent">
            Book Now
          </Link>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => setOpen(false)} className="btn-accent mt-2">
              Book Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
