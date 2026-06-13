import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { handler, ok, parseBody, requireRole, ApiError } from "@/lib/api";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateSchema = z.object({ handled: z.boolean() });

export const PATCH = handler(async (req, { params }: { params: { id: string } }) => {
  await requireRole("admin");
  const { handled } = await parseBody(req, updateSchema);
  await connectDB();
  const msg = await ContactMessage.findByIdAndUpdate(params.id, { handled }, { new: true }).lean();
  if (!msg) throw new ApiError("Message not found", 404);
  return ok({ ...msg, _id: String(msg._id) });
});

export const DELETE = handler(async (_req, { params }: { params: { id: string } }) => {
  await requireRole("admin");
  await connectDB();
  const msg = await ContactMessage.findByIdAndDelete(params.id).lean();
  if (!msg) throw new ApiError("Message not found", 404);
  return ok({ deleted: true });
});
