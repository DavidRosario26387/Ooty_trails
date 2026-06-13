import { connectDB } from "@/lib/db";
import { Vehicle } from "@/models/Vehicle";
import { handler, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

/**
 * Public, sanitized fleet availability.
 * Deliberately omits registration number and driver phone.
 */
export const GET = handler(async () => {
  await connectDB();
  const vehicles = await Vehicle.find({ active: true })
    .select("name type category seatingCapacity image status")
    .sort({ status: 1, name: 1 })
    .lean();

  return ok(
    vehicles.map((v) => ({
      id: String(v._id),
      name: v.name,
      type: v.type,
      category: v.category,
      seatingCapacity: v.seatingCapacity,
      image: v.image || null,
      status: v.status,
    })),
  );
});
