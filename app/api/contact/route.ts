import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { contactSchema } from "@/lib/validation";
import { handler, ok, parseBody } from "@/lib/api";

export const dynamic = "force-dynamic";

export const POST = handler(async (req) => {
  const input = await parseBody(req, contactSchema);
  await connectDB();
  await ContactMessage.create({ ...input, email: input.email || undefined });
  return ok({ received: true }, { status: 201 });
});
