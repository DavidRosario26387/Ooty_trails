"use client";

import { useState } from "react";
import useSWR from "swr";
import { useForm } from "react-hook-form";
import {
  User, Phone, Mail, MapPin, Calendar, Clock, Users, Car, StickyNote,
  CheckCircle2, Copy, Loader2, IndianRupee, Package,
} from "lucide-react";
import { fetcher, postJSON } from "@/lib/fetcher";
import { PACKAGES, whatsappLink } from "@/lib/constants";

interface FleetVehicle {
  id: string;
  name: string;
  type: string;
  category: string;
  seatingCapacity: number;
  image?: string | null;
  packagePrices: Record<string, number>;
  status: string;
}

type FormValues = {
  customerName: string;
  phone: string;
  email?: string;
  pickup: string;
  drop?: string;
  travelDate: string;
  travelTime: string;
  passengers: number;
  packageId: string;
  vehicleId: string;
  notes?: string;
};

interface Confirmation {
  bookingRef: string;
  packageName: string;
  vehicleName: string;
  fare: number;
  currency: string;
}

export default function BookingForm() {
  const { data: vehicles } = useSWR<FleetVehicle[]>("/api/fleet/status", fetcher);
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: { passengers: 2, packageId: "", vehicleId: "" },
  });
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [copied, setCopied] = useState(false);

  const packageId = watch("packageId");
  const vehicleId = watch("vehicleId");
  const fleet = vehicles ?? [];
  const selectedVehicle = fleet.find((v) => v.id === vehicleId);
  const selectedPackage = PACKAGES.find((p) => p.id === packageId);
  const price = selectedVehicle && packageId ? selectedVehicle.packagePrices?.[packageId] : undefined;

  async function onSubmit(values: FormValues) {
    setServerError(null);
    try {
      const data = await postJSON<Confirmation>("/api/bookings", values);
      setConfirmation(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Booking failed. Please try again.");
    }
  }

  if (confirmation) {
    const waMsg = `Hi Ready Go, I just booked the "${confirmation.packageName}" package (${confirmation.vehicleName}). My booking reference is ${confirmation.bookingRef}.`;
    return (
      <div className="card mx-auto max-w-lg p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-brand-500" />
        <h2 className="mt-4 font-display text-2xl font-bold text-slate-900">Booking request received!</h2>
        <p className="mt-2 text-sm text-slate-600">
          We&apos;ll confirm your cab and driver shortly via call or WhatsApp.
        </p>

        <div className="mt-6 rounded-2xl bg-brand-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Your booking reference</p>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="font-display text-2xl font-extrabold tracking-wider text-brand-800">{confirmation.bookingRef}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(confirmation.bookingRef);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="rounded-lg p-1.5 text-brand-600 hover:bg-brand-100"
              aria-label="Copy reference"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          {copied && <p className="mt-1 text-xs text-brand-600">Copied!</p>}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-slate-500">Package</p>
            <p className="font-semibold text-slate-900">{confirmation.packageName}</p>
            <p className="text-xs text-slate-400">{confirmation.vehicleName}</p>
          </div>
          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-slate-500">Fixed fare</p>
            <p className="font-semibold text-slate-900">₹{confirmation.fare.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">This is the all-inclusive package price, confirmed by our operator.</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappLink(waMsg)} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1">
            Share on WhatsApp
          </a>
          <button type="button" onClick={() => setConfirmation(null)} className="btn-outline flex-1">
            Make another booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6 lg:col-span-2">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" icon={User} error={formState.errors.customerName && "Name is required"}>
            <input className="input" placeholder="e.g. Priya Sharma" {...register("customerName", { required: true })} />
          </Field>
          <Field label="Phone number" icon={Phone} error={formState.errors.phone && "Phone is required"}>
            <input className="input" placeholder="10-digit mobile" {...register("phone", { required: true })} />
          </Field>
        </div>

        <Field label="Email (optional)" icon={Mail}>
          <input type="email" className="input" placeholder="you@example.com" {...register("email")} />
        </Field>

        <Field label="Choose a package" icon={Package} error={formState.errors.packageId && "Please choose a package"}>
          <select className="input" {...register("packageId", { required: true })}>
            <option value="">Select a package…</option>
            {PACKAGES.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Choose a vehicle" icon={Car} error={formState.errors.vehicleId && "Please choose a vehicle"}>
          <select className="input" {...register("vehicleId", { required: true })}>
            <option value="">{fleet.length ? "Select a vehicle…" : "Loading vehicles…"}</option>
            {fleet.map((v) => (
              <option key={v.id} value={v.id}>{v.name} — {v.type} ({v.seatingCapacity} seats)</option>
            ))}
          </select>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Pickup location" icon={MapPin} error={formState.errors.pickup && "Pickup is required"}>
            <input className="input" placeholder="e.g. Ooty Bus Stand / hotel" {...register("pickup", { required: true })} />
          </Field>
          <Field label="Drop location (if any)" icon={MapPin}>
            <input className="input" placeholder="e.g. Coimbatore Airport" {...register("drop")} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Travel date" icon={Calendar} error={formState.errors.travelDate && "Required"}>
            <input type="date" className="input" {...register("travelDate", { required: true })} />
          </Field>
          <Field label="Travel time" icon={Clock} error={formState.errors.travelTime && "Required"}>
            <input type="time" className="input" {...register("travelTime", { required: true })} />
          </Field>
          <Field label="Passengers" icon={Users}>
            <input type="number" min={1} max={20} className="input" {...register("passengers", { required: true, min: 1 })} />
          </Field>
        </div>

        <Field label="Additional notes (optional)" icon={StickyNote}>
          <textarea rows={3} className="input resize-none" placeholder="Trip plan, luggage, child seat, etc." {...register("notes")} />
        </Field>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button type="submit" className="btn-accent w-full text-base" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? (<><Loader2 className="h-5 w-5 animate-spin" /> Submitting…</>) : "Request booking"}
        </button>
        <p className="text-center text-xs text-slate-400">No payment needed now — we confirm your ride first.</p>
      </form>

      {/* Fixed package price sidebar */}
      <aside className="lg:col-span-1">
        <div className="card sticky top-20 p-6">
          <h3 className="font-display text-lg font-bold text-slate-900">Your package</h3>
          <p className="mt-1 text-sm text-slate-500">Fixed, all-inclusive price — no per-km charges.</p>

          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <span className="flex items-center gap-2 text-sm text-slate-600"><Package className="h-4 w-4 text-brand-500" /> Package</span>
              <p className="mt-1 font-semibold text-slate-900">{selectedPackage ? selectedPackage.name : "—"}</p>
              {selectedPackage && <p className="text-xs text-slate-500">{selectedPackage.desc}</p>}
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <span className="flex items-center gap-2 text-sm text-slate-600"><Car className="h-4 w-4 text-brand-500" /> Vehicle</span>
              <p className="mt-1 font-semibold text-slate-900">{selectedVehicle ? `${selectedVehicle.name} — ${selectedVehicle.type}` : "—"}</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-brand-50 p-4">
              <span className="flex items-center gap-2 text-sm text-brand-700"><IndianRupee className="h-4 w-4" /> Fixed fare</span>
              <span className="font-display text-xl font-bold text-brand-800">
                {price != null ? `₹${price.toLocaleString("en-IN")}` : "—"}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Final fare is the package price shown above and is confirmed by our operator before your trip.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  error?: string | false;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label flex items-center gap-1.5">
        <Icon className="h-4 w-4 text-brand-500" /> {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
