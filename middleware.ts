import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/jwt";

/**
 * Route protection at the edge.
 *
 * - /portal/admin/*  → must be logged in as admin
 * - /portal/driver/* → must be logged in as driver
 * - /api/admin/*     → admin only (returns 401/403 JSON)
 * - /api/driver/*    → driver only (returns 401/403 JSON)
 *
 * Public routes and /portal/login are untouched.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySession(token);

  const isApi = pathname.startsWith("/api/");
  const needsAdmin = pathname.startsWith("/portal/admin") || pathname.startsWith("/api/admin");
  const needsDriver = pathname.startsWith("/portal/driver") || pathname.startsWith("/api/driver");

  if (!needsAdmin && !needsDriver) return NextResponse.next();

  const requiredRole = needsAdmin ? "admin" : "driver";

  if (!session) {
    if (isApi) {
      return NextResponse.json({ ok: false, error: "Not authenticated" }, { status: 401 });
    }
    const loginUrl = new URL("/portal/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.role !== requiredRole) {
    if (isApi) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }
    // Send users to their own portal home instead of a dead end.
    const home = session.role === "admin" ? "/portal/admin/dashboard" : "/portal/driver";
    return NextResponse.redirect(new URL(home, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/admin/:path*", "/portal/driver/:path*", "/api/admin/:path*", "/api/driver/:path*"],
};
