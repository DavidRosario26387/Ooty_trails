import { cn } from "@/lib/cn";
import {
  VEHICLE_STATUS_META,
  BOOKING_STATUS_META,
  type VehicleStatus,
  type BookingStatus,
} from "@/lib/constants";

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  const meta = VEHICLE_STATUS_META[status] ?? VEHICLE_STATUS_META.off_duty;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        meta.tone,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const meta = BOOKING_STATUS_META[status] ?? BOOKING_STATUS_META.new;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
        meta.tone,
      )}
    >
      {meta.label}
    </span>
  );
}
