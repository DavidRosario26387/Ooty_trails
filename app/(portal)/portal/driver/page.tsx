"use client";

import useSWR, { mutate } from "swr";
import { Car, Users, MapPin, Calendar, Clock, Phone, ClipboardList, AlertCircle } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { PageHeader, CardPanel, EmptyState, INR } from "@/components/portal/widgets";
import { VehicleStatusBadge, BookingStatusBadge } from "@/components/ui/StatusBadge";
import DriverStatusControl from "@/components/portal/DriverStatusControl";
import Placeholder from "@/components/ui/Placeholder";
import type { VehicleStatus, BookingStatus } from "@/lib/constants";

interface DriverData {
  driver: { name: string } | null;
  vehicle: {
    _id: string; name: string; type: string; category: string; registrationNumber: string;
    seatingCapacity: number; image?: string; status: VehicleStatus;
  } | null;
  currentBookings: {
    _id: string; bookingRef: string; customerName: string; phone: string;
    pickup: string; drop?: string; travelDate: string; travelTime: string;
    passengers: number; packageName: string; fare: number; status: BookingStatus;
  }[];
}

export default function DriverHome() {
  const { data, isLoading } = useSWR<DriverData>("/api/driver/me", fetcher, { refreshInterval: 20000 });

  if (isLoading || !data) {
    return (<><PageHeader title="My Vehicle" /><p className="text-sm text-slate-500">Loading…</p></>);
  }

  const { vehicle, currentBookings } = data;

  if (!vehicle) {
    return (
      <>
        <PageHeader title="My Vehicle" subtitle="Your assigned vehicle and live status." />
        <div className="card flex items-center gap-3 p-6 text-amber-700">
          <AlertCircle className="h-6 w-6" />
          <div>
            <p className="font-semibold">No vehicle assigned yet</p>
            <p className="text-sm text-amber-600">Please ask your admin to assign a vehicle to your account.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="My Vehicle" subtitle="Update your status and see your assigned trips." />

      <div className="grid gap-6 lg:grid-cols-3">
        <CardPanel className="lg:col-span-2">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="sm:w-48">
              {vehicle.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={vehicle.image} alt={vehicle.name} className="h-32 w-full rounded-xl object-cover" />
              ) : (
                <Placeholder label={`Replace with image of ${vehicle.name}`} className="h-32" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">{vehicle.name}</h3>
                  <p className="text-sm text-slate-500">{vehicle.type} · {vehicle.category}</p>
                </div>
                <VehicleStatusBadge status={vehicle.status} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1.5"><Car className="h-4 w-4 text-slate-400" /> {vehicle.registrationNumber}</span>
                <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4 text-slate-400" /> {vehicle.seatingCapacity} seats</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <h4 className="mb-3 font-display text-sm font-bold text-slate-900">Update your status</h4>
            <DriverStatusControl
              current={vehicle.status}
              onChanged={() => mutate("/api/driver/me")}
            />
          </div>
        </CardPanel>

        <CardPanel title="Current & upcoming trips">
          {currentBookings.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No trips assigned" desc="Assigned bookings will appear here." />
          ) : (
            <div className="space-y-3">
              {currentBookings.map((b) => (
                <div key={b._id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-700">{b.bookingRef}</span>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <p className="mt-1 font-semibold text-slate-800">{b.customerName}</p>
                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {b.pickup}{b.drop ? ` → ${b.drop}` : ""}</p>
                    <p className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {b.travelDate} <Clock className="ml-1 h-3.5 w-3.5" /> {b.travelTime}</p>
                    <a href={`tel:${b.phone}`} className="flex items-center gap-1.5 hover:text-brand-600"><Phone className="h-3.5 w-3.5" /> {b.phone}</a>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-700"><INR value={b.fare} /> · {b.packageName} · {b.passengers} pax</p>
                </div>
              ))}
            </div>
          )}
        </CardPanel>
      </div>
    </>
  );
}
