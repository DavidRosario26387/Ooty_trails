import { connectDB } from "@/lib/db";
import { Booking, generateBookingRef } from "@/models/Booking";
import { Customer } from "@/models/Customer";
import { Vehicle } from "@/models/Vehicle";
import { bookingSchema } from "@/lib/validation";
import { handler, ok, parseBody, ApiError } from "@/lib/api";
import { DEFAULT_FARE, getPackage, toPriceMap } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const POST = handler(async (req) => {
  const input = await parseBody(req, bookingSchema);
  await connectDB();

  // Resolve the fixed fare server-side from the chosen vehicle's package price.
  const pkg = getPackage(input.packageId);
  if (!pkg) throw new ApiError("Unknown package selected", 400);

  const vehicle = await Vehicle.findOne({ _id: input.vehicleId, active: true })
    .select("name packagePrices")
    .lean();
  if (!vehicle) throw new ApiError("Selected vehicle is not available", 400);

  const fare = toPriceMap(vehicle.packagePrices)[input.packageId];
  if (fare == null) throw new ApiError("This vehicle has no price for the selected package", 400);

  // Generate a unique booking reference (retry on the rare collision).
  let bookingRef = generateBookingRef();
  for (let i = 0; i < 5; i++) {
    if (!(await Booking.exists({ bookingRef }))) break;
    bookingRef = generateBookingRef();
  }

  const booking = await Booking.create({
    ...input,
    email: input.email || undefined,
    drop: input.drop || undefined,
    bookingRef,
    packageName: pkg.name,
    vehicleName: vehicle.name,
    fare,
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
      packageName: pkg.name,
      vehicleName: vehicle.name,
      fare,
      currency: DEFAULT_FARE.currency,
    },
    { status: 201 },
  );
});
