import { connectDB } from "@/lib/db";
import { Booking, generateBookingRef } from "@/models/Booking";
import { Customer } from "@/models/Customer";
import { Vehicle } from "@/models/Vehicle";
import { bookingSchema } from "@/lib/validation";
import { estimateDistance, estimateFare } from "@/lib/distance";
import { handler, ok, parseBody } from "@/lib/api";
import { DEFAULT_FARE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const POST = handler(async (req) => {
  const input = await parseBody(req, bookingSchema);
  await connectDB();

  // Estimate distance + fare server-side (don't trust client values).
  const { distanceKm } = await estimateDistance(input.pickup, input.drop);
  let rates = { baseFare: DEFAULT_FARE.baseFare, pricePerKm: DEFAULT_FARE.pricePerKm };
  if (input.vehiclePreference) {
    const v = await Vehicle.findOne({ category: input.vehiclePreference, active: true })
      .select("baseFare pricePerKm")
      .lean();
    if (v) rates = { baseFare: v.baseFare, pricePerKm: v.pricePerKm };
  }
  const estimatedFare = estimateFare(distanceKm, rates);

  // Generate a unique booking reference (retry on the rare collision).
  let bookingRef = generateBookingRef();
  for (let i = 0; i < 5; i++) {
    if (!(await Booking.exists({ bookingRef }))) break;
    bookingRef = generateBookingRef();
  }

  const booking = await Booking.create({
    ...input,
    email: input.email || undefined,
    bookingRef,
    estimatedDistanceKm: distanceKm,
    estimatedFare,
    status: "new",
  });

  // Upsert the customer record (keyed by phone).
  await Customer.findOneAndUpdate(
    { phone: input.phone },
    {
      $set: { name: input.customerName, email: input.email || undefined, lastBookingAt: new Date() },
      $inc: { bookingCount: 1 },
    },
    { upsert: true, new: true },
  );

  return ok(
    {
      bookingRef: booking.bookingRef,
      estimatedDistanceKm: distanceKm,
      estimatedFare,
      currency: DEFAULT_FARE.currency,
    },
    { status: 201 },
  );
});
