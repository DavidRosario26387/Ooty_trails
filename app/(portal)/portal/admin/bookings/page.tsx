"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import {
  Phone, MapPin, Calendar, Clock, Users, Check, X, CarFront, Flag, ClipboardList, Package,
} from "lucide-react";
import { fetcher, postJSON } from "@/lib/fetcher";
import { PageHeader, EmptyState, INR } from "@/components/portal/widgets";
import { BookingStatusBadge } from "@/components/ui/StatusBadge";
import { BOOKING_STATUSES, type BookingStatus } from "@/lib/constants";
import { cn } from "@/lib/cn";

interface Booking {
  _id: string;
  bookingRef: string;
  customerName: string;
  phone: string;
  email?: string;
  pickup: string;
  drop?: string;
  travelDate: string;
  travelTime: string;
  passengers: number;
  packageName: string;
  vehicleName: string;
  fare: number;
  notes?: string;
  status: BookingStatus;
  assignedVehicle?: { _id: string; name: string; registrationNumber: string } | null;
  assignedDriver?: { _id: string; name: string; phone?: string } | null;
  createdAt: string;
}

interface VehicleOption {
  _id: string;
  name: string;
  registrationNumber: string;
  status: string;
}

const FILTERS = ["all", ...BOOKING_STATUSES] as const;

export default function BookingsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const key = filter === "all" ? "/api/admin/bookings" : `/api/admin/bookings?status=${filter}`;
  const { data: bookings, isLoading } = useSWR<Booking[]>(key, fetcher, { refreshInterval: 20000 });
  const { data: vehicles } = useSWR<VehicleOption[]>("/api/admin/vehicles", fetcher);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function update(id: string, payload: Record<string, unknown>) {
    setBusyId(id);
    try {
      await postJSON(`/api/admin/bookings/${id}`, payload, "PATCH");
      await mutate(key);
      await mutate("/api/admin/analytics");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  const list = bookings ?? [];

  return (
    <>
      <PageHeader title="Bookings" subtitle="Review, accept, assign and complete booking requests." />

      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f ? "bg-brand-500 text-white" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading bookings…</p>
      ) : list.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No bookings here" desc="Bookings matching this filter will show up here." />
      ) : (
        <div className="space-y-4">
          {list.map((b) => (
            <div key={b._id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-brand-700">{b.bookingRef}</span>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <p className="mt-1 font-semibold text-slate-900">{b.customerName}</p>
                  <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600">
                    <Phone className="h-3.5 w-3.5" /> {b.phone}
                  </a>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-slate-900"><INR value={b.fare} /></p>
                  <p className="text-xs text-slate-400">{b.vehicleName}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                <span className="inline-flex items-center gap-1.5"><Package className="h-4 w-4 text-brand-500" /> {b.packageName}</span>
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-brand-500" /> {b.pickup}{b.drop ? ` → ${b.drop}` : ""}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4 text-brand-500" /> {b.travelDate} · {b.travelTime}</span>
                <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-brand-500" /> {b.passengers} pax</span>
              </div>

              {b.notes && <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">“{b.notes}”</p>}

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                {/* Assign vehicle (auto-pulls its driver) */}
                <div className="flex items-center gap-2">
                  <CarFront className="h-4 w-4 text-slate-400" />
                  <select
                    className="input max-w-[220px] py-2"
                    value={b.assignedVehicle?._id || ""}
                    disabled={busyId === b._id}
                    onChange={(e) => update(b._id, { assignedVehicle: e.target.value || null })}
                  >
                    <option value="">Assign vehicle…</option>
                    {(vehicles ?? []).map((v) => (
                      <option key={v._id} value={v._id}>{v.name} ({v.registrationNumber})</option>
                    ))}
                  </select>
                </div>

                {b.assignedDriver && (
                  <span className="text-xs text-slate-500">Driver: <strong>{b.assignedDriver.name}</strong></span>
                )}

                <div className="ml-auto flex flex-wrap gap-2">
                  {b.status === "new" && (
                    <>
                      <button disabled={busyId === b._id} onClick={() => update(b._id, { status: "confirmed" })} className="btn-primary py-2">
                        <Check className="h-4 w-4" /> Accept
                      </button>
                      <button disabled={busyId === b._id} onClick={() => update(b._id, { status: "cancelled" })} className="btn-outline py-2 text-red-600 ring-red-200 hover:bg-red-50">
                        <X className="h-4 w-4" /> Reject
                      </button>
                    </>
                  )}
                  {b.status === "confirmed" && (
                    <button disabled={busyId === b._id} onClick={() => update(b._id, { status: "completed" })} className="btn-accent py-2">
                      <Flag className="h-4 w-4" /> Mark completed
                    </button>
                  )}
                  {(b.status === "completed" || b.status === "cancelled") && (
                    <button disabled={busyId === b._id} onClick={() => update(b._id, { status: "new" })} className="btn-ghost py-2 text-slate-500">
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
