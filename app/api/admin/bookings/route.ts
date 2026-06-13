import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { handler, ok, requireRole } from "@/lib/api";
import { BOOKING_STATUSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const GET = handler(async (req) => {
  await requireRole("admin");
  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const query: Record<string, unknown> = {};
  if (status && (BOOKING_STATUSES as readonly string[]).includes(status)) query.status = status;

  const bookings = await Booking.find(query)
    .populate("assignedVehicle", "name registrationNumber category")
    .populate("assignedDriver", "name phone")
    .sort({ createdAt: -1 })
    .limit(300)
    .lean();

  return ok(bookings.map((b) => ({ ...b, _id: String(b._id) })));
});
