"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { postJSON } from "@/lib/fetcher";
import { VEHICLE_STATUSES, VEHICLE_STATUS_META, type VehicleStatus } from "@/lib/constants";
import { cn } from "@/lib/cn";

export default function DriverStatusControl({
  current,
  onChanged,
}: {
  current: VehicleStatus;
  onChanged: (status: VehicleStatus) => void;
}) {
  const [busy, setBusy] = useState<VehicleStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function set(status: VehicleStatus) {
    if (status === current) return;
    setBusy(status);
    setError(null);
    try {
      await postJSON<{ status: VehicleStatus }>("/api/driver/status", { status }, "PATCH");
      onChanged(status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't update status");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {VEHICLE_STATUSES.map((s) => {
          const meta = VEHICLE_STATUS_META[s];
          const active = s === current;
          return (
            <button
              key={s}
              onClick={() => set(s)}
              disabled={busy !== null}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all",
                active
                  ? "border-transparent bg-brand-500 text-white shadow-soft"
                  : "border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50",
              )}
            >
              {busy === s ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className={cn("h-2 w-2 rounded-full", active ? "bg-white" : meta.dot)} />
              )}
              {meta.label}
            </button>
          );
        })}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <p className="mt-3 text-xs text-slate-400">Your status updates instantly on the customer website.</p>
    </div>
  );
}
