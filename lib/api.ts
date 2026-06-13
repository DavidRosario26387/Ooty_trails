import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";
import { getSession, type SessionPayload } from "@/lib/auth";
import type { UserRole } from "@/lib/constants";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400, extra?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

/** Parse + validate a JSON request body. Returns data or throws an ApiError. */
export async function parseBody<T>(req: Request, schema: ZodSchema<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new ApiError("Invalid JSON body", 400);
  }
  try {
    return schema.parse(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ApiError(err.issues[0]?.message ?? "Validation failed", 422, {
        issues: err.flatten().fieldErrors,
      });
    }
    throw err;
  }
}

export class ApiError extends Error {
  status: number;
  extra?: Record<string, unknown>;
  constructor(message: string, status = 400, extra?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

/** Wrap a route handler so thrown ApiErrors become clean JSON responses. */
export function handler(fn: (req: Request, ctx: any) => Promise<Response>) {
  return async (req: Request, ctx: any): Promise<Response> => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      if (err instanceof ApiError) return fail(err.message, err.status, err.extra);
      console.error("[api] unhandled error:", err);
      return fail("Something went wrong. Please try again.", 500);
    }
  };
}

/** Require a logged-in user; optionally require a specific role. */
export async function requireRole(role?: UserRole): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new ApiError("Not authenticated", 401);
  if (role && session.role !== role) throw new ApiError("Forbidden", 403);
  return session;
}
