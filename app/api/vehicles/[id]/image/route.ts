import { connectDB } from "@/lib/db";
import { Vehicle } from "@/models/Vehicle";

export const dynamic = "force-dynamic";

/**
 * Serves a single vehicle's photo as binary (not base64-in-JSON), so the fleet
 * and admin list endpoints stay small and fast. Images are stored on the
 * vehicle as a data-URL (uploaded) or a plain URL (pasted).
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const v = await Vehicle.findById(params.id).select("image").lean();
    const image = v?.image;
    if (!image) return new Response("Not found", { status: 404 });

    // External URL — redirect the browser straight to it.
    if (!image.startsWith("data:")) return Response.redirect(image, 302);

    const match = /^data:([^;]+);base64,(.*)$/s.exec(image);
    if (!match) return new Response("Unsupported image", { status: 422 });
    const buf = Buffer.from(match[2], "base64");
    return new Response(buf, {
      headers: {
        "Content-Type": match[1],
        "Content-Length": String(buf.length),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
