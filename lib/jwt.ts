import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { UserRole } from "@/lib/constants";

// Edge-safe session helpers (jose only — no Node APIs). Imported by middleware.
export const SESSION_COOKIE = "ootygo_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (seconds)

export interface SessionPayload extends JWTPayload {
  sub: string; // user id
  role: UserRole;
  name: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set (see .env.example).");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: {
  sub: string;
  role: UserRole;
  name: string;
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

/** Verify a raw token. Returns the payload or null (safe in Edge middleware). */
export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}
