import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";
import { driverSchema } from "@/lib/validation";
import { handler, ok, parseBody, requireRole, ApiError } from "@/lib/api";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await requireRole("admin");
  await connectDB();
  const drivers = await User.find({ role: "driver" })
    .select("-passwordHash")
    .populate("assignedVehicle", "name registrationNumber status")
    .sort({ createdAt: -1 })
    .lean();
  return ok(drivers.map((d) => ({ ...d, _id: String(d._id) })));
});

export const POST = handler(async (req) => {
  await requireRole("admin");
  const input = await parseBody(req, driverSchema);
  await connectDB();

  const exists = await User.findOne({ email: input.email.toLowerCase() });
  if (exists) throw new ApiError("A user with this email already exists", 409);

  const driver = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash: await hashPassword(input.password),
    role: "driver",
    phone: input.phone,
    assignedVehicle: input.assignedVehicle || null,
  });

  // Sync vehicle side of the link.
  if (input.assignedVehicle) {
    await Vehicle.findByIdAndUpdate(input.assignedVehicle, {
      assignedDriver: driver._id,
      driverPhone: input.phone,
    });
  }

  const obj = driver.toObject();
  delete (obj as any).passwordHash;
  return ok({ ...obj, _id: String(driver._id) }, { status: 201 });
});
