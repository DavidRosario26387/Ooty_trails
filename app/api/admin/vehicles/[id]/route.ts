import { connectDB } from "@/lib/db";
import { Vehicle } from "@/models/Vehicle";
import { User } from "@/models/User";
import { vehicleUpdateSchema } from "@/lib/validation";
import { handler, ok, parseBody, requireRole, ApiError } from "@/lib/api";

export const dynamic = "force-dynamic";

export const PATCH = handler(async (req, { params }: { params: { id: string } }) => {
  await requireRole("admin");
  const input = await parseBody(req, vehicleUpdateSchema);
  await connectDB();

  const vehicle = await Vehicle.findById(params.id);
  if (!vehicle) throw new ApiError("Vehicle not found", 404);

  // Handle driver re-assignment, keeping both sides of the link consistent.
  if (input.assignedDriver !== undefined) {
    const prevDriver = vehicle.assignedDriver ? String(vehicle.assignedDriver) : null;
    const nextDriver = input.assignedDriver || null;

    if (prevDriver && prevDriver !== nextDriver) {
      await User.findByIdAndUpdate(prevDriver, { assignedVehicle: null });
    }
    if (nextDriver) {
      // Unlink the new driver from any other vehicle first.
      await Vehicle.updateMany(
        { _id: { $ne: vehicle._id }, assignedDriver: nextDriver },
        { assignedDriver: null },
      );
      await User.findByIdAndUpdate(nextDriver, { assignedVehicle: vehicle._id });
    }
  }

  Object.assign(vehicle, input, { assignedDriver: input.assignedDriver ?? vehicle.assignedDriver });
  await vehicle.save();

  const { image: _img, ...rest } = vehicle.toObject();
  return ok({ ...rest, _id: String(vehicle._id) });
});

export const DELETE = handler(async (_req, { params }: { params: { id: string } }) => {
  await requireRole("admin");
  await connectDB();
  const vehicle = await Vehicle.findById(params.id);
  if (!vehicle) throw new ApiError("Vehicle not found", 404);

  if (vehicle.assignedDriver) {
    await User.findByIdAndUpdate(vehicle.assignedDriver, { assignedVehicle: null });
  }
  await vehicle.deleteOne();
  return ok({ deleted: true });
});
