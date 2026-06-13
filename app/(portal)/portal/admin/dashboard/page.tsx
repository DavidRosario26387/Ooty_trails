"use client";

import useSWR from "swr";
import Link from "next/link";
import {
  IndianRupee, Users, Car, CalendarCheck, Radio, ArrowRight, ClipboardList, MessageSquare,
} from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { PageHeader, MetricCard, CardPanel, EmptyState, INR } from "@/components/portal/widgets";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import type { BookingStatus } from "@/lib/constants";

interface Analytics {
  metrics: {
    totalRevenue: number;
    totalBookings: number;
    registeredCustomers: number;
    liveVehicles: number;
    availableVehicles: number;
    totalVehicles: number;
  };
}

interface BookingRow {
  _id: string;
  bookingRef: string;
  customerName: string;
  pickup: string;
  drop: string;
  travelDate: string;
  status: BookingStatus;
  estimatedFare: number;
}

export default function AdminDashboard() {
  const { data: analytics } = useSWR<Analytics>("/api/admin/analytics", fetcher, { refreshInterval: 30000 });
  const { data: bookings } = useSWR<BookingRow[]>("/api/admin/bookings", fetcher, { refreshInterval: 20000 });
  const { data: messages } = useSWR<{ handled: boolean }[]>("/api/admin/messages", fetcher, { refreshInterval: 30000 });

  const m = analytics?.metrics;
  const recent = (bookings ?? []).slice(0, 6);
  const newCount = (bookings ?? []).filter((b) => b.status === "new").length;
  const newMessages = (messages ?? []).filter((x) => !x.handled).length;

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your fleet, bookings and revenue." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total revenue" value={m ? `₹${m.totalRevenue.toLocaleString("en-IN")}` : "—"} icon={IndianRupee} tone="brand" hint="From completed trips" />
        <MetricCard label="Registered customers" value={m?.registeredCustomers ?? "—"} icon={Users} tone="blue" />
        <MetricCard label="Live / on trip" value={m ? `${m.liveVehicles}` : "—"} icon={Radio} tone="accent" hint={m ? `${m.availableVehicles} available now` : undefined} />
        <MetricCard label="Total bookings" value={m?.totalBookings ?? "—"} icon={CalendarCheck} tone="violet" hint={`${newCount} new to review`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <CardPanel title="Recent bookings" className="lg:col-span-2">
          {recent.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No bookings yet" desc="New booking requests will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="pb-2">Ref</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Route</th>
                    <th className="pb-2">Fare</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map((b) => (
                    <tr key={b._id}>
                      <td className="py-3 font-mono text-xs font-semibold text-brand-700">{b.bookingRef}</td>
                      <td className="py-3 text-slate-700">{b.customerName}</td>
                      <td className="py-3 text-slate-500">{b.pickup} → {b.drop}</td>
                      <td className="py-3 font-medium text-slate-700"><INR value={b.estimatedFare} /></td>
                      <td className="py-3"><BookingStatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Link href="/portal/admin/bookings" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all bookings <ArrowRight className="h-4 w-4" />
          </Link>
        </CardPanel>

        <CardPanel title="Quick actions">
          <div className="space-y-2">
            <Link href="/portal/admin/bookings" className="btn-outline w-full justify-start"><CalendarCheck className="h-4 w-4" /> Review bookings {newCount > 0 && <span className="ml-auto rounded-full bg-accent-500 px-2 py-0.5 text-xs text-white">{newCount}</span>}</Link>
            <Link href="/portal/admin/vehicles" className="btn-outline w-full justify-start"><Car className="h-4 w-4" /> Manage vehicles</Link>
            <Link href="/portal/admin/drivers" className="btn-outline w-full justify-start"><Users className="h-4 w-4" /> Manage drivers</Link>
            <Link href="/portal/admin/messages" className="btn-outline w-full justify-start"><MessageSquare className="h-4 w-4" /> Messages {newMessages > 0 && <span className="ml-auto rounded-full bg-accent-500 px-2 py-0.5 text-xs text-white">{newMessages}</span>}</Link>
            <Link href="/portal/admin/analytics" className="btn-outline w-full justify-start"><IndianRupee className="h-4 w-4" /> View analytics</Link>
          </div>
          <div className="mt-4 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
            <p className="font-semibold">Fleet snapshot</p>
            <p className="mt-1 text-brand-700">{m ? `${m.availableVehicles} of ${m.totalVehicles} vehicles available` : "Loading…"}</p>
          </div>
        </CardPanel>
      </div>
    </>
  );
}
