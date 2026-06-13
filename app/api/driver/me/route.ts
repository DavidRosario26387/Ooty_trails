import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";
import { Booking } from "@/models/Booking";
import { handler, ok, requireRole } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  const session = await requireRole("driver");
  await connectDB();

  const driver = await User.findById(session.sub).select("-passwordHash").lean();
  const vehicle = driver?.assignedVehicle
    ? await Vehicle.findById(driver.assignedVehicle).lean()
    : null;

  // Current / upcoming bookings assigned to this driver (not yet completed/cancelled).
  const currentBookings = await Booking.find({
    assignedDriver: session.sub,
    status: { $in: ["new", "confirmed"] },
  })
    .sort({ travelDate: 1, travelTime: 1 })
    .lean();

  return ok({
    driver: driver ? { ...driver, _id: String(driver._id) } : null,
    vehicle: vehicle ? { ...vehicle, _id: String(vehicle._id) } : null,
    currentBookings: currentBookings.map((b) => ({ ...b, _id: String(b._id) })),
  });
});
