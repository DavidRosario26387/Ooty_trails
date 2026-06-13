"use client";

import useSWR from "swr";
import Link from "next/link";
import { Users, Car, RefreshCw } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { VehicleStatusBadge } from "@/components/ui/StatusBadge";
import Placeholder from "@/components/ui/Placeholder";
import SectionHeader from "./SectionHeader";
import type { VehicleStatus } from "@/lib/constants";

interface PublicVehicle {
  id: string;
  name: string;
  type: string;
  category: string;
  seatingCapacity: number;
  image?: string;
  status: VehicleStatus;
}

export default function FleetAvailability({ compact = false }: { compact?: boolean }) {
  // Poll every 15s so driver/admin status changes appear on the public site live.
  const { data, isLoading, error } = useSWR<PublicVehicle[]>("/api/fleet/status", fetcher, {
    refreshInterval: 15000,
    revalidateOnFocus: true,
  });

  const vehicles = data ?? [];
  const availableCount = vehicles.filter((v) => v.status === "available").length;

  return (
    <section className="section bg-white">
      <div className="container-page">
        <SectionHeader
          eyebrow="Live availability"
          title="See our fleet status in real time"
          subtitle="Vehicle statuses update live as our drivers head out and return — no guesswork."
        />

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
          <RefreshCw className="h-4 w-4 animate-spin [animation-duration:3s]" />
          {isLoading ? "Loading fleet…" : `${availableCount} of ${vehicles.length} vehicles available now`}
        </div>

        {error && (
          <p className="mt-6 text-center text-sm text-red-600">
            Couldn&apos;t load live availability. Please refresh.
          </p>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <div key={v.id} className="card overflow-hidden">
              {v.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.image} alt={v.name} className="h-40 w-full object-cover" />
              ) : (
                // Replace with image of the actual vehicle (set in admin portal)
                <Placeholder label={`Replace with image of ${v.name}`} className="h-40" rounded="rounded-none" />
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">{v.name}</h3>
                    <p className="text-xs text-slate-500">{v.type} · {v.category}</p>
                  </div>
                  <VehicleStatusBadge status={v.status} />
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <Users className="h-4 w-4 text-brand-500" /> Up to {v.seatingCapacity} passengers
                </div>
              </div>
            </div>
          ))}

          {!isLoading && vehicles.length === 0 && !error && (
            <div className="col-span-full flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 py-12 text-center text-slate-500">
              <Car className="h-8 w-8" />
              <p>No vehicles published yet. Please check back soon or contact us to book.</p>
            </div>
          )}
        </div>

        {compact && (
          <div className="mt-10 text-center">
            <Link href="/book" className="btn-primary">Book an available cab</Link>
          </div>
        )}
      </div>
    </section>
  );
}
