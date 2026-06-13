import { DEFAULT_FARE } from "@/lib/constants";

/**
 * Distance & fare estimation.
 *
 * Strategy (free-first, Google pluggable):
 *  1. Curated table of common Ooty routes (instant, no network).
 *  2. Free OpenStreetMap Nominatim geocoding + Haversine × road factor.
 *  3. If GOOGLE_MAPS_API_KEY is set, use Google Distance Matrix instead.
 *
 * Per the plan this is "best effort" — if everything fails we fall back to a
 * sensible default distance so a booking can still be created (the operator
 * confirms the final fare).
 */

const ROAD_FACTOR = 1.3; // straight-line → road distance fudge factor
const FALLBACK_KM = 15; // used only if all estimation methods fail

export interface DistanceResult {
  distanceKm: number;
  source: "curated" | "google" | "geocode" | "fallback";
}

// Curated distances (km) from Ooty town to popular spots. Keys are lowercase keywords.
const OOTY_ROUTES: { keywords: string[]; km: number }[] = [
  { keywords: ["coimbatore airport", "cjb", "coimbatore"], km: 88 },
  { keywords: ["mettupalayam"], km: 36 },
  { keywords: ["coonoor"], km: 19 },
  { keywords: ["kotagiri"], km: 31 },
  { keywords: ["pykara"], km: 19 },
  { keywords: ["avalanche"], km: 28 },
  { keywords: ["emerald"], km: 25 },
  { keywords: ["doddabetta"], km: 10 },
  { keywords: ["botanical", "rose garden", "ooty lake", "ooty town", "charring cross"], km: 4 },
  { keywords: ["tea factory", "dodabetta tea"], km: 7 },
  { keywords: ["mudumalai", "masinagudi"], km: 36 },
  { keywords: ["bandipur"], km: 50 },
  { keywords: ["mysore", "mysuru"], km: 125 },
  { keywords: ["bangalore", "bengaluru"], km: 270 },
  { keywords: ["sims park"], km: 19 },
];

function matchCurated(text: string): number | null {
  const t = text.toLowerCase();
  for (const r of OOTY_ROUTES) {
    if (r.keywords.some((k) => t.includes(k))) return r.km;
  }
  return null;
}

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}

const geocodeCache = new Map<string, { lat: number; lon: number } | null>();

async function geocode(place: string): Promise<{ lat: number; lon: number } | null> {
  const key = place.trim().toLowerCase();
  if (geocodeCache.has(key)) return geocodeCache.get(key)!;

  try {
    // Bias results toward the Nilgiris/Ooty region by appending context.
    const q = encodeURIComponent(`${place}, Tamil Nadu, India`);
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`, {
      headers: { "User-Agent": "OotyTrails/1.0 (cab booking)" },
      // Don't let a slow geocoder hang a booking request.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`geocode ${res.status}`);
    const json = (await res.json()) as Array<{ lat: string; lon: string }>;
    const hit = json[0] ? { lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon) } : null;
    geocodeCache.set(key, hit);
    return hit;
  } catch {
    geocodeCache.set(key, null);
    return null;
  }
}

async function googleDistance(pickup: string, drop: string): Promise<number | null> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return null;
  try {
    const url =
      `https://maps.googleapis.com/maps/api/distancematrix/json` +
      `?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(drop)}` +
      `&units=metric&key=${key}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const json: any = await res.json();
    const meters = json?.rows?.[0]?.elements?.[0]?.distance?.value;
    return typeof meters === "number" ? meters / 1000 : null;
  } catch {
    return null;
  }
}

export async function estimateDistance(pickup: string, drop: string): Promise<DistanceResult> {
  // 1. Google (only if explicitly enabled)
  const g = await googleDistance(pickup, drop);
  if (g != null) return { distanceKm: round(g), source: "google" };

  // 2. Curated table — match against either endpoint (Ooty is usually one end).
  const curated = matchCurated(drop) ?? matchCurated(pickup);
  if (curated != null) return { distanceKm: curated, source: "curated" };

  // 3. Geocode + Haversine
  const [a, b] = await Promise.all([geocode(pickup), geocode(drop)]);
  if (a && b) {
    const km = haversineKm(a, b) * ROAD_FACTOR;
    return { distanceKm: round(Math.max(km, 1)), source: "geocode" };
  }

  // 4. Fallback
  return { distanceKm: FALLBACK_KM, source: "fallback" };
}

export function estimateFare(
  distanceKm: number,
  opts?: { baseFare?: number; pricePerKm?: number },
): number {
  const baseFare = opts?.baseFare ?? DEFAULT_FARE.baseFare;
  const pricePerKm = opts?.pricePerKm ?? DEFAULT_FARE.pricePerKm;
  return Math.round(baseFare + distanceKm * pricePerKm);
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}
