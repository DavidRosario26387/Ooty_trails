import { connectDB } from "@/lib/db";
import { Vehicle } from "@/models/Vehicle";
import { handler, ok } from "@/lib/api";
import { toPriceMap } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Public, sanitized fleet availability.
 * Deliberately omits registration number and driver phone. The heavy image
 * blob is NOT inlined — we return a URL to the dedicated image route instead.
 */
export const GET = handler(async () => {
  await connectDB();
  // Project only a `hasImage` flag so the big image blob never leaves the DB.
  const vehicles = await Vehicle.aggregate([
    { $match: { active: true } },
    { $sort: { status: 1, name: 1 } },
    {
      $project: {
        name: 1, type: 1, category: 1, seatingCapacity: 1, status: 1, packagePrices: 1, updatedAt: 1,
        hasImage: { $and: [{ $ne: ["$image", null] }, { $ne: ["$image", ""] }] },
      },
    },
  ]);

  return ok(
    vehicles.map((v) => ({
      id: String(v._id),
      name: v.name,
      type: v.type,
      category: v.category,
      seatingCapacity: v.seatingCapacity,
      image: v.hasImage ? `/api/vehicles/${String(v._id)}/image?v=${new Date(v.updatedAt).getTime()}` : null,
      packagePrices: toPriceMap(v.packagePrices),
      status: v.status,
    })),
  );
});
