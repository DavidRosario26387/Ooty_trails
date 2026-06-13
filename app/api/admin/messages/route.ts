import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { handler, ok, requireRole } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = handler(async () => {
  await requireRole("admin");
  await connectDB();
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(500).lean();
  return ok(messages.map((m) => ({ ...m, _id: String(m._id) })));
});
