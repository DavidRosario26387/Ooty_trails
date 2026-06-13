"use client";

import { useState } from "react";
import useSWR from "swr";
import { Users, Search, Phone, Mail } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { PageHeader, EmptyState } from "@/components/portal/widgets";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  bookingCount: number;
  lastBookingAt?: string;
}

export default function CustomersPage() {
  const { data: customers, isLoading } = useSWR<Customer[]>("/api/admin/customers", fetcher);
  const [q, setQ] = useState("");

  const list = (customers ?? []).filter((c) => {
    const t = q.trim().toLowerCase();
    if (!t) return true;
    return c.name.toLowerCase().includes(t) || c.phone.includes(t) || (c.email || "").toLowerCase().includes(t);
  });

  return (
    <>
      <PageHeader title="Customers" subtitle="Everyone who has booked with you, built automatically from bookings." />

      <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, phone or email…"
          className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading customers…</p>
      ) : list.length === 0 ? (
        <EmptyState icon={Users} title="No customers found" desc="Customers appear here after their first booking." />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Bookings</th>
                <th className="px-5 py-3">Last booking</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-medium text-slate-800">{c.name}</td>
                  <td className="px-5 py-3 text-slate-600">
                    <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1 hover:text-brand-600"><Phone className="h-3.5 w-3.5" /> {c.phone}</a>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {c.email ? <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {c.email}</span> : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{c.bookingCount}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{c.lastBookingAt ? new Date(c.lastBookingAt).toLocaleDateString("en-IN") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
