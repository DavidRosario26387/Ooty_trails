"use client";

import useSWR from "swr";
import { Package } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { fetcher } from "@/lib/fetcher";
import { PACKAGES } from "@/lib/constants";

interface FleetVehicle {
  id: string;
  name: string;
  type: string;
  packagePrices: Record<string, number>;
}

/** Public, read-only price list — packages × vehicles, priced by the admin. */
export default function PackagesPricing() {
  const { data } = useSWR<FleetVehicle[]>("/api/fleet/status", fetcher);
  const vehicles = data ?? [];

  return (
    <section className="section bg-white">
      <div className="container-page">
        <SectionHeader
          eyebrow="Our packages"
          title="Simple, fixed package prices"
          subtitle="Choose a sightseeing or transfer package and your vehicle — the price is fixed and all-inclusive, with no per-km charges."
        />

        <div className="mx-auto mt-10 max-w-3xl overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-left text-xs uppercase tracking-wider text-brand-700">
              <tr>
                <th className="px-5 py-3">Package</th>
                {vehicles.map((v) => (
                  <th key={v.id} className="px-5 py-3 text-right">{v.name}<span className="block font-normal normal-case text-brand-600/70">{v.type}</span></th>
                ))}
                {vehicles.length === 0 && <th className="px-5 py-3 text-right">Price</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PACKAGES.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2 font-semibold text-slate-900">
                      <Package className="h-4 w-4 text-brand-500" /> {p.name}
                    </span>
                    <span className="text-xs text-slate-500">{p.desc}</span>
                  </td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="px-5 py-3 text-right font-semibold text-slate-800">
                      {v.packagePrices?.[p.id] != null ? `₹${v.packagePrices[p.id].toLocaleString("en-IN")}` : "—"}
                    </td>
                  ))}
                  {vehicles.length === 0 && <td className="px-5 py-3 text-right text-slate-400">—</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Coimbatore railway station &amp; airport packages are priced the same for pickup or drop.
        </p>
      </div>
    </section>
  );
}
