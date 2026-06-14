import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { handler, ok, requireRole } from "@/lib/api";

export const dynamic = "force-dynamic";

/** A driver's ferry / trip history — completed trips on their account. */
export const GET = handler(async () => {
  const session = await requireRole("driver");
  await connectDB();

  const trips = await Booking.find({
    assignedDriver: session.sub,
    status: "completed",
  })
    .sort({ completedAt: -1, updatedAt: -1 })
    .limit(200)
    .lean();

  const totalEarnings = trips.reduce((s, t) => s + (t.fare || 0), 0);

  return ok({
    trips: trips.map((t) => ({ ...t, _id: String(t._id) })),
    summary: { count: trips.length, totalEarnings },
  });
});
