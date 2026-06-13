import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";
import { driverStatusSchema } from "@/lib/validation";
import { handler, ok, parseBody, requireRole, ApiError } from "@/lib/api";

export const dynamic = "force-dynamic";

/** Driver updates the status of their own assigned vehicle. Reflects live on the public site. */
export const PATCH = handler(async (req) => {
  const session = await requireRole("driver");
  const { status } = await parseBody(req, driverStatusSchema);
  await connectDB();

  const driver = await User.findById(session.sub).select("assignedVehicle").lean();
  if (!driver?.assignedVehicle) throw new ApiError("No vehicle assigned to you yet", 400);

  const vehicle = await Vehicle.findByIdAndUpdate(
    driver.assignedVehicle,
    { status },
    { new: true },
  ).lean();
  if (!vehicle) throw new ApiError("Assigned vehicle not found", 404);

  return ok({ status: vehicle.status });
});
