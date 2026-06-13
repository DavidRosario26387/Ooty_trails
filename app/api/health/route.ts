import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Lightweight health check — also handy as a free keep-alive ping target
// (e.g. cron-job.org) to avoid Render free-tier cold starts.
export function GET() {
  return NextResponse.json({ ok: true, service: "ootygo", time: new Date().toISOString() });
}
