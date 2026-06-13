"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Car, Users, IndianRupee } from "lucide-react";
import { fetcher, postJSON } from "@/lib/fetcher";
import { PageHeader, EmptyState } from "@/components/portal/widgets";
import { VehicleStatusBadge } from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import Placeholder from "@/components/ui/Placeholder";
import { VEHICLE_CATEGORIES, VEHICLE_STATUSES, VEHICLE_STATUS_META, type VehicleStatus } from "@/lib/constants";

interface DriverRef { _id: string; name: string; phone?: string }
interface Vehicle {
  _id: string;
  name: string; type: string; category: string; seatingCapacity: number;
  registrationNumber: string; assignedDriver?: DriverRef | null; driverPhone?: string;
  pricePerKm: number; baseFare: number; image?: string; status: VehicleStatus; active: boolean;
}
interface Driver { _id: string; name: string; phone?: string }

type FormValues = Omit<Vehicle, "_id" | "assignedDriver"> & { assignedDriver?: string };

export default function VehiclesPage() {
  const { data: vehicles, isLoading } = useSWR<Vehicle[]>("/api/admin/vehicles", fetcher);
  const { data: drivers } = useSWR<Driver[]>("/api/admin/drivers", fetcher);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm<FormValues>();

  function openNew() {
    setEditing(null);
    reset({
      name: "", type: "", category: "Sedan", seatingCapacity: 4, registrationNumber: "",
      pricePerKm: 18, baseFare: 250, image: "", status: "available", driverPhone: "", assignedDriver: "",
    } as any);
    setOpen(true);
  }
  function openEdit(v: Vehicle) {
    setEditing(v);
    reset({ ...v, assignedDriver: v.assignedDriver?._id || "" } as any);
    setOpen(true);
  }

  async function onSubmit(values: FormValues) {
    const payload = { ...values, assignedDriver: values.assignedDriver || null };
    try {
      if (editing) await postJSON(`/api/admin/vehicles/${editing._id}`, payload, "PATCH");
      else await postJSON("/api/admin/vehicles", payload, "POST");
      await mutate("/api/admin/vehicles");
      await mutate("/api/admin/drivers");
      setOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function remove(v: Vehicle) {
    if (!confirm(`Delete vehicle "${v.name}"? This cannot be undone.`)) return;
    try {
      await postJSON(`/api/admin/vehicles/${v._id}`, {}, "DELETE");
      await mutate("/api/admin/vehicles");
      await mutate("/api/admin/drivers");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const list = vehicles ?? [];

  return (
    <>
      <PageHeader
        title="Vehicles"
        subtitle="Manage your fleet, rates and driver assignments."
        action={<button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4" /> Add vehicle</button>}
      />

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading vehicles…</p>
      ) : list.length === 0 ? (
        <EmptyState icon={Car} title="No vehicles yet" desc="Add your first vehicle to start accepting bookings." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((v) => (
            <div key={v._id} className="card overflow-hidden">
              {v.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.image} alt={v.name} className="h-40 w-full object-cover" />
              ) : (
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
                <div className="mt-3 space-y-1 text-sm text-slate-600">
                  <p className="flex items-center gap-1.5"><Car className="h-4 w-4 text-slate-400" /> {v.registrationNumber}</p>
                  <p className="flex items-center gap-1.5"><Users className="h-4 w-4 text-slate-400" /> {v.seatingCapacity} seats</p>
                  <p className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4 text-slate-400" /> ₹{v.baseFare} base · ₹{v.pricePerKm}/km</p>
                  <p className="text-xs text-slate-500">Driver: {v.assignedDriver?.name || "Unassigned"}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEdit(v)} className="btn-outline flex-1 py-2"><Pencil className="h-4 w-4" /> Edit</button>
                  <button onClick={() => remove(v)} className="btn-outline py-2 text-red-600 ring-red-200 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit vehicle" : "Add vehicle"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="input" placeholder="e.g. KBN Etios" {...register("name", { required: true })} />
            </div>
            <div>
              <label className="label">Type / Model</label>
              <input className="input" placeholder="e.g. Toyota Etios" {...register("type", { required: true })} />
            </div>
            <div>
              <label className="label">Category</label>
              <select className="input" {...register("category", { required: true })}>
                {VEHICLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Seating capacity</label>
              <input type="number" min={1} className="input" {...register("seatingCapacity", { required: true, valueAsNumber: true })} />
            </div>
            <div>
              <label className="label">Registration number</label>
              <input className="input uppercase" placeholder="TN 43 XX 0000" {...register("registrationNumber", { required: true })} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" {...register("status")}>
                {VEHICLE_STATUSES.map((s) => <option key={s} value={s}>{VEHICLE_STATUS_META[s].label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Base fare (₹)</label>
              <input type="number" min={0} className="input" {...register("baseFare", { required: true, valueAsNumber: true })} />
            </div>
            <div>
              <label className="label">Price per km (₹)</label>
              <input type="number" min={0} step="0.5" className="input" {...register("pricePerKm", { required: true, valueAsNumber: true })} />
            </div>
            <div>
              <label className="label">Assign driver</label>
              <select className="input" {...register("assignedDriver")}>
                <option value="">Unassigned</option>
                {(drivers ?? []).map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Driver phone</label>
              <input className="input" placeholder="Optional" {...register("driverPhone")} />
            </div>
          </div>
          <div>
            <label className="label">Image URL (optional)</label>
            <input className="input" placeholder="https://… (leave blank to show a placeholder)" {...register("image")} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "Saving…" : editing ? "Save changes" : "Add vehicle"}
          </button>
        </form>
      </Modal>
    </>
  );
}
