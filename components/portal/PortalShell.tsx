"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarCheck, Car, Users, UserRound, BarChart3, MessageSquare,
  Menu, X, Mountain, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/cn";
import LogoutButton from "./LogoutButton";

const ICONS = { LayoutDashboard, CalendarCheck, Car, Users, UserRound, BarChart3, MessageSquare } as const;

export interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
}

export default function PortalShell({
  title,
  nav,
  userName,
  children,
}: {
  title: string;
  nav: NavItem[];
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarBody = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
          <Mountain className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-base font-extrabold leading-none">
            <span className="text-brand-600">Ready</span><span className="text-accent-500"> Go</span>
          </p>
          <p className="text-[11px] text-slate-400">{title}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map((item) => {
          const Icon = ICONS[item.icon];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-slate-100 p-3">
        <Link href="/" target="_blank" className="btn-ghost w-full justify-start text-slate-600">
          <ExternalLink className="h-4 w-4" /> View website
        </Link>
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-100 bg-white lg:block">
        {SidebarBody}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">{SidebarBody}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur lg:px-8">
          <button className="rounded-lg p-2 text-slate-600 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Hi, <span className="font-semibold text-slate-800">{userName}</span></span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {open && (
        <button className="fixed right-4 top-4 z-50 rounded-lg bg-white p-2 shadow lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
