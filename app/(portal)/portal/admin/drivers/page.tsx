"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, UserRound, Phone, Car, Mail } from "lucide-react";
import { fetcher, postJSON } from "@/lib/fetcher";
import { PageHeader, EmptyState } from "@/components/portal/widgets";
import Modal from "@/components/ui/Modal";

interface VehicleRef { _id: string; name: string; registrationNumber: string; status: string }
interface Driver {
  _id: string; name: string; email: string; phone?: string;
  assignedVehicle?: VehicleRef | null; active: boolean;
}
interface VehicleOption { _id: string; name: string; registrationNumber: string }

type FormValues = {
  name: string; email: string; password?: string; phone?: string;
  assignedVehicle?: string; active?: boolean;
};

export default function DriversPage() {
  const { data: drivers, isLoading } = useSWR<Driver[]>("/api/admin/drivers", fetcher);
  const { data: vehicles } = useSWR<VehicleOption[]>("/api/admin/vehicles", fetcher);
  const [editing, setEditing] = useState<Driver | null>(null);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState } = useForm<FormValues>();

  function openNew() {
    setEditing(null);
    reset({ name: "", email: "", password: "", phone: "", assignedVehicle: "" });
    setOpen(true);
  }
  function openEdit(d: Driver) {
    setEditing(d);
    reset({ name: d.name, email: d.email, phone: d.phone || "", password: "", assignedVehicle: d.assignedVehicle?._id || "", active: d.active });
    setOpen(true);
  }

  async function onSubmit(values: FormValues) {
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          name: values.name, phone: values.phone,
          assignedVehicle: values.assignedVehicle || null, active: values.active,
        };
        if (values.password) payload.password = values.password;
        await postJSON(`/api/admin/drivers/${editing._id}`, payload, "PATCH");
      } else {
        await postJSON("/api/admin/drivers", { ...values, assignedVehicle: values.assignedVehicle || null }, "POST");
      }
      await mutate("/api/admin/drivers");
      await mutate("/api/admin/vehicles");
      setOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Save failed");
    }
  }

  async function remove(d: Driver) {
    if (!confirm(`Delete driver "${d.name}"?`)) return;
    try {
      await postJSON(`/api/admin/drivers/${d._id}`, {}, "DELETE");
      await mutate("/api/admin/drivers");
      await mutate("/api/admin/vehicles");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  const list = drivers ?? [];

  return (
    <>
      <PageHeader
        title="Drivers"
        subtitle="Manage driver accounts and vehicle assignments."
        action={<button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4" /> Add driver</button>}
      />

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading drivers…</p>
      ) : list.length === 0 ? (
        <EmptyState icon={UserRound} title="No drivers yet" desc="Add driver accounts so they can update vehicle status from their own login." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((d) => (
            <div key={d._id} className="card p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-base font-bold text-brand-700">
                  {d.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-base font-bold text-slate-900">{d.name}</h3>
                  {!d.active && <span className="text-xs font-semibold text-red-500">Inactive</span>}
                </div>
              </div>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p className="flex items-center gap-1.5"><Mail className="h-4 w-4 text-slate-400" /> {d.email}</p>
                <p className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-slate-400" /> {d.phone || "—"}</p>
                <p className="flex items-center gap-1.5"><Car className="h-4 w-4 text-slate-400" /> {d.assignedVehicle ? `${d.assignedVehicle.name} (${d.assignedVehicle.registrationNumber})` : "No vehicle"}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => openEdit(d)} className="btn-outline flex-1 py-2"><Pencil className="h-4 w-4" /> Edit</button>
                <button onClick={() => remove(d)} className="btn-outline py-2 text-red-600 ring-red-200 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit driver" : "Add driver"}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" {...register("name", { required: true })} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Email {editing && <span className="text-xs text-slate-400">(can't change)</span>}</label>
              <input type="email" className="input" disabled={!!editing} {...register("email", { required: !editing })} />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" {...register("phone")} />
            </div>
          </div>
          <div>
            <label className="label">{editing ? "New password (leave blank to keep)" : "Password"}</label>
            <input type="password" className="input" placeholder={editing ? "••••••••" : "At least 6 characters"} {...register("password", { required: !editing })} />
          </div>
          <div>
            <label className="label">Assign vehicle</label>
            <select className="input" {...register("assignedVehicle")}>
              <option value="">Unassigned</option>
              {(vehicles ?? []).map((v) => <option key={v._id} value={v._id}>{v.name} ({v.registrationNumber})</option>)}
            </select>
          </div>
          {editing && (
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" {...register("active")} /> Active account
            </label>
          )}
          <button type="submit" className="btn-primary w-full" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "Saving…" : editing ? "Save changes" : "Add driver"}
          </button>
        </form>
      </Modal>
    </>
  );
}
