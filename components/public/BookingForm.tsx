"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  User, Phone, Mail, MapPin, Calendar, Clock, Users, Car, StickyNote,
  CheckCircle2, Copy, Loader2, IndianRupee, Route,
} from "lucide-react";
import { postJSON } from "@/lib/fetcher";
import { VEHICLE_CATEGORIES } from "@/lib/constants";
import { whatsappLink } from "@/lib/constants";

type FormValues = {
  customerName: string;
  phone: string;
  email?: string;
  pickup: string;
  drop: string;
  travelDate: string;
  travelTime: string;
  passengers: number;
  vehiclePreference?: string;
  notes?: string;
};

interface Estimate {
  distanceKm: number;
  fare: number;
  currency: string;
}

interface Confirmation {
  bookingRef: string;
  estimatedDistanceKm: number;
  estimatedFare: number;
  currency: string;
}

export default function BookingForm() {
  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: { passengers: 2 },
  });
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [copied, setCopied] = useState(false);

  const pickup = watch("pickup");
  const drop = watch("drop");
  const vehiclePreference = watch("vehiclePreference");

  // Debounced live fare estimate whenever pickup/drop/vehicle change.
  useEffect(() => {
    if (!pickup || !drop || pickup.trim().length < 2 || drop.trim().length < 2) {
      setEstimate(null);
      return;
    }
    let cancelled = false;
    setEstimating(true);
    const t = setTimeout(async () => {
      try {
        const data = await postJSON<Estimate>("/api/estimate", { pickup, drop, vehiclePreference });
        if (!cancelled) setEstimate(data);
      } catch {
        if (!cancelled) setEstimate(null);
      } finally {
        if (!cancelled) setEstimating(false);
      }
    }, 700);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [pickup, drop, vehiclePreference]);

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
    const waMsg = `Hi Ooty Trails, I just booked a cab. My booking reference is ${confirmation.bookingRef}.`;
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
            <p className="text-slate-500">Est. distance</p>
            <p className="font-semibold text-slate-900">{confirmation.estimatedDistanceKm} km</p>
          </div>
          <div className="rounded-xl border border-slate-100 p-3">
            <p className="text-slate-500">Est. fare</p>
            <p className="font-semibold text-slate-900">₹{confirmation.estimatedFare}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">Fare is approximate and will be confirmed by our operator.</p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappLink(waMsg)} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1">
            Share on WhatsApp
          </a>
          <button onClick={() => { setConfirmation(null); setEstimate(null); }} className="btn-outline flex-1">
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

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Pickup location" icon={MapPin} error={formState.errors.pickup && "Pickup is required"}>
            <input className="input" placeholder="e.g. Ooty Bus Stand" {...register("pickup", { required: true })} />
          </Field>
          <Field label="Drop location" icon={MapPin} error={formState.errors.drop && "Drop is required"}>
            <input className="input" placeholder="e.g. Pykara Lake" {...register("drop", { required: true })} />
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

        <Field label="Vehicle preference" icon={Car}>
          <select className="input" {...register("vehiclePreference")}>
            <option value="">Any vehicle</option>
            {VEHICLE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Additional notes (optional)" icon={StickyNote}>
          <textarea rows={3} className="input resize-none" placeholder="Trip plan, luggage, child seat, etc." {...register("notes")} />
        </Field>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button type="submit" className="btn-accent w-full text-base" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? (<><Loader2 className="h-5 w-5 animate-spin" /> Submitting…</>) : "Request booking"}
        </button>
        <p className="text-center text-xs text-slate-400">No payment needed now — we confirm your ride first.</p>
      </form>

      {/* Live estimate sidebar */}
      <aside className="lg:col-span-1">
        <div className="card sticky top-20 p-6">
          <h3 className="font-display text-lg font-bold text-slate-900">Fare estimate</h3>
          <p className="mt-1 text-sm text-slate-500">Updates as you enter pickup &amp; drop.</p>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <span className="flex items-center gap-2 text-sm text-slate-600"><Route className="h-4 w-4 text-brand-500" /> Distance</span>
              <span className="font-semibold text-slate-900">
                {estimating ? <Loader2 className="h-4 w-4 animate-spin" /> : estimate ? `${estimate.distanceKm} km` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-brand-50 p-4">
              <span className="flex items-center gap-2 text-sm text-brand-700"><IndianRupee className="h-4 w-4" /> Estimated fare</span>
              <span className="font-display text-xl font-bold text-brand-800">
                {estimating ? <Loader2 className="h-4 w-4 animate-spin" /> : estimate ? `₹${estimate.fare}` : "—"}
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Estimates are approximate (based on typical Ooty routes) and confirmed by our operator before your trip.
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
