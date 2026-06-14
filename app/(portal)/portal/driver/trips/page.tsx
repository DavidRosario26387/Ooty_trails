"use client";

import useSWR from "swr";
import { IndianRupee, MapPin, History, Package } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { PageHeader, MetricCard, EmptyState, INR } from "@/components/portal/widgets";

interface Trip {
  _id: string;
  bookingRef: string;
  customerName: string;
  pickup: string;
  drop?: string;
  travelDate: string;
  packageName: string;
  vehicleName: string;
  fare: number;
  completedAt?: string;
}
interface TripsData {
  trips: Trip[];
  summary: { count: number; totalEarnings: number };
}

export default function DriverTrips() {
  const { data, isLoading } = useSWR<TripsData>("/api/driver/trips", fetcher);

  if (isLoading || !data) {
    return (<><PageHeader title="Trip History" /><p className="text-sm text-slate-500">Loading…</p></>);
  }

  return (
    <>
      <PageHeader title="Trip History" subtitle="Your completed ferries and earnings." />

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Completed trips" value={data.summary.count} icon={History} tone="brand" />
        <MetricCard label="Total earnings" value={`₹${data.summary.totalEarnings.toLocaleString("en-IN")}`} icon={IndianRupee} tone="accent" />
      </div>

      <div className="mt-6">
        {data.trips.length === 0 ? (
          <EmptyState icon={History} title="No completed trips yet" desc="Trips show here once they're marked completed." />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-3">Ref</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Route</th>
                  <th className="px-5 py-3">Package</th>
                  <th className="px-5 py-3">Fare</th>
                  <th className="px-5 py-3">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.trips.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50">
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-brand-700">{t.bookingRef}</td>
                    <td className="px-5 py-3 text-slate-700">{t.customerName}</td>
                    <td className="px-5 py-3 text-slate-500"><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {t.pickup}{t.drop ? ` → ${t.drop}` : ""}</span></td>
                    <td className="px-5 py-3 text-slate-600"><span className="inline-flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {t.packageName}</span></td>
                    <td className="px-5 py-3 font-medium text-slate-700"><INR value={t.fare} /></td>
                    <td className="px-5 py-3 text-slate-500">{t.completedAt ? new Date(t.completedAt).toLocaleDateString("en-IN") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
