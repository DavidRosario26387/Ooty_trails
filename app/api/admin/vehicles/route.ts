import { connectDB } from "@/lib/db";
import { Vehicle } from "@/models/Vehicle";
import { User } from "@/models/User";
import { vehicleSchema } from "@/lib/validation";
import { handler, ok, parseBody, requireRole, ApiError } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await requireRole("admin");
  await connectDB();
  const vehicles = await Vehicle.find()
    .populate("assignedDriver", "name phone")
    .sort({ createdAt: -1 })
    .lean();
  return ok(vehicles.map((v) => ({ ...v, _id: String(v._id) })));
});

export const POST = handler(async (req) => {
  await requireRole("admin");
  const input = await parseBody(req, vehicleSchema);
  await connectDB();

  const exists = await Vehicle.findOne({ registrationNumber: input.registrationNumber.toUpperCase() });
  if (exists) throw new ApiError("A vehicle with this registration number already exists", 409);

  const vehicle = await Vehicle.create({
    ...input,
    assignedDriver: input.assignedDriver || null,
  });

  // Keep the driver's assignedVehicle in sync.
  if (input.assignedDriver) {
    await User.findByIdAndUpdate(input.assignedDriver, { assignedVehicle: vehicle._id });
  }

  return ok({ ...vehicle.toObject(), _id: String(vehicle._id) }, { status: 201 });
});
