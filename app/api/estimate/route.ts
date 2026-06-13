import { connectDB } from "@/lib/db";
import { Vehicle } from "@/models/Vehicle";
import { estimateSchema } from "@/lib/validation";
import { estimateDistance, estimateFare } from "@/lib/distance";
import { handler, ok, parseBody } from "@/lib/api";
import { DEFAULT_FARE } from "@/lib/constants";

export const dynamic = "force-dynamic";

/** Pick representative fare rates for a category, falling back to defaults. */
async function ratesFor(category?: string) {
  if (!category) return { baseFare: DEFAULT_FARE.baseFare, pricePerKm: DEFAULT_FARE.pricePerKm };
  const v = await Vehicle.findOne({ category, active: true }).select("baseFare pricePerKm").lean();
  return v
    ? { baseFare: v.baseFare, pricePerKm: v.pricePerKm }
    : { baseFare: DEFAULT_FARE.baseFare, pricePerKm: DEFAULT_FARE.pricePerKm };
}

export const POST = handler(async (req) => {
  const input = await parseBody(req, estimateSchema);
  await connectDB();

  const { distanceKm, source } = await estimateDistance(input.pickup, input.drop);
  const rates = await ratesFor(input.vehiclePreference);
  const fare = estimateFare(distanceKm, rates);

  return ok({
    distanceKm,
    fare,
    currency: DEFAULT_FARE.currency,
    approximate: true,
    source,
  });
});
