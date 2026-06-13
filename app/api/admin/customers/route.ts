import { connectDB } from "@/lib/db";
import { Customer } from "@/models/Customer";
import { handler, ok, requireRole } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await requireRole("admin");
  await connectDB();
  const customers = await Customer.find().sort({ lastBookingAt: -1 }).limit(500).lean();
  return ok(customers.map((c) => ({ ...c, _id: String(c._id) })));
});
