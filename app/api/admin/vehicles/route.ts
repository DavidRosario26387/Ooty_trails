import { connectDB } from "@/lib/db";
import { Vehicle } from "@/models/Vehicle";
import { User } from "@/models/User";
import { vehicleSchema } from "@/lib/validation";
import { handler, ok, parseBody, requireRole, ApiError } from "@/lib/api";
import { toPriceMap } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await requireRole("admin");
  await connectDB();
  // Exclude the heavy image blob; expose a URL to the dedicated image route.
  const vehicles = await Vehicle.find()
    .select("-image")
    .populate("assignedDriver", "name phone")
    .sort({ createdAt: -1 })
    .lean();
  const withImage = new Set(
    (await Vehicle.find({ image: { $exists: true, $nin: [null, ""] } }).select("_id").lean())
      .map((v) => String(v._id)),
  );
  return ok(
    vehicles.map((v) => ({
      ...v,
      _id: String(v._id),
      packagePrices: toPriceMap(v.packagePrices),
      image: withImage.has(String(v._id))
        ? `/api/vehicles/${String(v._id)}/image?v=${new Date(v.updatedAt).getTime()}`
        : "",
    })),
  );
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

  const { image: _img, ...rest } = vehicle.toObject();
  return ok({ ...rest, _id: String(vehicle._id) }, { status: 201 });
});
