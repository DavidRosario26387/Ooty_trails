import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { handler, ok, parseBody, ApiError } from "@/lib/api";
import { signSession, setSessionCookie, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const POST = handler(async (req) => {
  const { email, password } = await parseBody(req, loginSchema);
  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !user.active) throw new ApiError("Invalid email or password", 401);

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw new ApiError("Invalid email or password", 401);

  const token = await signSession({ sub: String(user._id), role: user.role, name: user.name });
  setSessionCookie(token);

  return ok({
    user: { id: String(user._id), name: user.name, role: user.role, email: user.email },
    redirect: user.role === "admin" ? "/portal/admin/dashboard" : "/portal/driver",
  });
});
