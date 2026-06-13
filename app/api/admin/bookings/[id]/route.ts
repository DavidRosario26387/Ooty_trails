import { connectDB } from "@/lib/db";
import { Booking } from "@/models/Booking";
import { Vehicle } from "@/models/Vehicle";
import { bookingUpdateSchema } from "@/lib/validation";
import { handler, ok, parseBody, requireRole, ApiError } from "@/lib/api";

export const dynamic = "force-dynamic";

export const PATCH = handler(async (req, { params }: { params: { id: string } }) => {
  await requireRole("admin");
  const input = await parseBody(req, bookingUpdateSchema);
  await connectDB();

  const booking = await Booking.findById(params.id);
  if (!booking) throw new ApiError("Booking not found", 404);

  // Assign a vehicle → auto-pull its assigned driver if none chosen explicitly.
  if (input.assignedVehicle !== undefined) {
    booking.assignedVehicle = (input.assignedVehicle || null) as any;
    if (input.assignedVehicle && input.assignedDriver === undefined) {
      const v = await Vehicle.findById(input.assignedVehicle).select("assignedDriver").lean();
      if (v?.assignedDriver) booking.assignedDriver = v.assignedDriver as any;
    }
  }
  if (input.assignedDriver !== undefined) {
    booking.assignedDriver = (input.assignedDriver || null) as any;
  }

  if (input.status !== undefined) {
    booking.status = input.status;
    booking.completedAt = input.status === "completed" ? new Date() : null;
  }

  await booking.save();
  const populated = await booking.populate([
    { path: "assignedVehicle", select: "name registrationNumber category" },
    { path: "assignedDriver", select: "name phone" },
  ]);

  return ok({ ...populated.toObject(), _id: String(booking._id) });
});
