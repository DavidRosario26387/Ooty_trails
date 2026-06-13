import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";
import { driverUpdateSchema } from "@/lib/validation";
import { handler, ok, parseBody, requireRole, ApiError } from "@/lib/api";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const PATCH = handler(async (req, { params }: { params: { id: string } }) => {
  await requireRole("admin");
  const input = await parseBody(req, driverUpdateSchema);
  await connectDB();

  const driver = await User.findOne({ _id: params.id, role: "driver" });
  if (!driver) throw new ApiError("Driver not found", 404);

  // Vehicle re-assignment, keeping both sides consistent.
  if (input.assignedVehicle !== undefined) {
    const prev = driver.assignedVehicle ? String(driver.assignedVehicle) : null;
    const next = input.assignedVehicle || null;
    if (prev && prev !== next) {
      await Vehicle.findByIdAndUpdate(prev, { assignedDriver: null, driverPhone: undefined });
    }
    if (next) {
      await User.updateMany(
        { _id: { $ne: driver._id }, assignedVehicle: next },
        { assignedVehicle: null },
      );
      await Vehicle.findByIdAndUpdate(next, {
        assignedDriver: driver._id,
        driverPhone: input.phone ?? driver.phone,
      });
    }
    driver.assignedVehicle = next as any;
  }

  if (input.name !== undefined) driver.name = input.name;
  if (input.phone !== undefined) driver.phone = input.phone;
  if (input.active !== undefined) driver.active = input.active;
  if (input.password) driver.passwordHash = await hashPassword(input.password);

  await driver.save();
  const obj = driver.toObject();
  delete (obj as any).passwordHash;
  return ok({ ...obj, _id: String(driver._id) });
});

export const DELETE = handler(async (_req, { params }: { params: { id: string } }) => {
  await requireRole("admin");
  await connectDB();
  const driver = await User.findOne({ _id: params.id, role: "driver" });
  if (!driver) throw new ApiError("Driver not found", 404);

  if (driver.assignedVehicle) {
    await Vehicle.findByIdAndUpdate(driver.assignedVehicle, {
      assignedDriver: null,
      driverPhone: undefined,
    });
  }
  await driver.deleteOne();
  return ok({ deleted: true });
});
