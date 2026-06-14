"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Car, Users, IndianRupee, ImagePlus } from "lucide-react";
import { fetcher, postJSON } from "@/lib/fetcher";
import { PageHeader, EmptyState } from "@/components/portal/widgets";
import { VehicleStatusBadge } from "@/components/ui/StatusBadge";
import Modal from "@/components/ui/Modal";
import Placeholder from "@/components/ui/Placeholder";
import { PACKAGES, VEHICLE_CATEGORIES, VEHICLE_STATUSES, VEHICLE_STATUS_META, type VehicleStatus } from "@/lib/constants";

interface DriverRef { _id: string; name: string; phone?: string }
interface Vehicle {
  _id: string;
  name: string; type: string; category: string; seatingCapacity: number;
  registrationNumber: string; assignedDriver?: DriverRef | null; driverPhone?: string;
  packagePrices: Record<string, number>; image?: string; status: VehicleStatus; active: boolean;
}
interface Driver { _id: string; name: string; phone?: string }

type FormValues = {
  name: string; type: string; category: string; seatingCapacity: number;
  registrationNumber: string; assignedDriver?: string; driverPhone?: string;
  status: VehicleStatus; packagePrices: Record<string, number>;
};

// Read an image file and downscale it to a compact JPEG data-URL so it can be
// stored directly on the vehicle (no file server needed — survives redeploys).
async function fileToDataUrl(file: File, maxDim = 1000, quality = 0.8): Promise<string> {
  const original = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("read failed"));
    reader.readAsDataURL(file);
  });
  const img = document.createElement("img");
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("decode failed"));
    img.src = original;
  });
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return original;
  ctx.fillStyle = "#fff"; // flatten transparency for JPEG
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL("image/jpeg", quality);
}

const emptyPrices = () => Object.fromEntries(PACKAGES.map((p) => [p.id, "" as unknown as number]));

export default function VehiclesPage() {
  const { data: vehicles, isLoading } = useSWR<Vehicle[]>("/api/admin/vehicles", fetcher);
  const { data: drivers } = useSWR<Driver[]>("/api/admin/drivers", fetcher);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [open, setOpen] = useState(false);
  const [imgBusy, setImgBusy] = useState(false);
  // Image is managed outside RHF so we only send it when it actually changes.
  const [imagePreview, setImagePreview] = useState("");
  const [imageAction, setImageAction] = useState<"keep" | "set" | "clear">("keep");
  const { register, handleSubmit, reset, formState } = useForm<FormValues>();

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    setImgBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      setImagePreview(dataUrl);
      setImageAction("set");
    } catch {
      alert("Couldn't process that image. Please try another file.");
    } finally {
      setImgBusy(false);
      e.target.value = ""; // let the admin re-pick the same file if needed
    }
  }

  function openNew() {
    setEditing(null);
    reset({
      name: "", type: "", category: "Sedan", seatingCapacity: 4, registrationNumber: "",
      status: "available", driverPhone: "", assignedDriver: "", packagePrices: emptyPrices(),
    });
    setImagePreview("");
    setImageAction("keep");
    setOpen(true);
  }
  function openEdit(v: Vehicle) {
    setEditing(v);
    reset({
      name: v.name, type: v.type, category: v.category, seatingCapacity: v.seatingCapacity,
      registrationNumber: v.registrationNumber, status: v.status, driverPhone: v.driverPhone || "",
      assignedDriver: v.assignedDriver?._id || "", packagePrices: { ...emptyPrices(), ...(v.packagePrices || {}) },
    });
    setImagePreview(v.image || "");
    setImageAction("keep");
    setOpen(true);
  }

  async function onSubmit(values: FormValues) {
    const payload: Record<string, unknown> = { ...values, assignedDriver: values.assignedDriver || null };
    if (imageAction === "set") payload.image = imagePreview;
    else if (imageAction === "clear") payload.image = "";
    // "keep" → omit image so the existing photo is preserved.
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

  // URL shown in the "paste a URL" box — hide data-URLs and internal image routes.
  const urlBoxValue = imagePreview.startsWith("data:") || imagePreview.startsWith("/api/") ? "" : imagePreview;
  const list = vehicles ?? [];

  return (
    <>
      <PageHeader
        title="Vehicles"
        subtitle="Manage your fleet, package prices and driver assignments."
        action={<button onClick={openNew} className="btn-primary"><Plus className="h-4 w-4" /> Add vehicle</button>}
      />

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading vehicles…</p>
      ) : list.length === 0 ? (
        <EmptyState icon={Car} title="No vehicles yet" desc="Add your first vehicle to start accepting bookings." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((v) => {
            const priced = PACKAGES.filter((p) => v.packagePrices?.[p.id] != null).length;
            return (
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
                  <p className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4 text-slate-400" /> {priced}/{PACKAGES.length} packages priced</p>
                  <p className="text-xs text-slate-500">Driver: {v.assignedDriver?.name || "Unassigned"}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => openEdit(v)} className="btn-outline flex-1 py-2"><Pencil className="h-4 w-4" /> Edit</button>
                  <button onClick={() => remove(v)} className="btn-outline py-2 text-red-600 ring-red-200 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
            );
          })}
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

          {/* Per-package prices — required for every package. */}
          <div>
            <label className="label">Package prices (₹)</label>
            <p className="-mt-1 mb-2 text-xs text-slate-400">Set the fixed fare for this vehicle for every package.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {PACKAGES.map((p) => (
                <div key={p.id}>
                  <label className="text-xs font-medium text-slate-600">{p.name}</label>
                  <input
                    type="number"
                    min={0}
                    className="input"
                    placeholder="₹"
                    {...register(`packagePrices.${p.id}` as const, { required: true, valueAsNumber: true, min: 0 })}
                  />
                </div>
              ))}
            </div>
            {formState.errors.packagePrices && (
              <p className="mt-1 text-xs text-red-600">Enter a price for every package.</p>
            )}
          </div>

          <div>
            <label className="label">Vehicle image (optional)</label>
            {imagePreview ? (
              <div className="relative mt-1 overflow-hidden rounded-xl border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Vehicle preview" className="h-40 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(""); setImageAction("clear"); }}
                  className="absolute right-2 top-2 rounded-lg bg-white/90 px-2 py-1 text-xs font-semibold text-red-600 shadow hover:bg-white"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="mt-1 flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:border-brand-400 hover:text-brand-600">
                <ImagePlus className="h-6 w-6" />
                <span>{imgBusy ? "Processing…" : "Click to upload a photo"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={onPickImage} disabled={imgBusy} />
              </label>
            )}
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-slate-400">or paste an image URL instead</summary>
              <input
                className="input mt-2"
                placeholder="https://…"
                value={urlBoxValue}
                onChange={(e) => { setImagePreview(e.target.value); setImageAction(e.target.value ? "set" : "clear"); }}
              />
            </details>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "Saving…" : editing ? "Save changes" : "Add vehicle"}
          </button>
        </form>
      </Modal>
    </>
  );
}
