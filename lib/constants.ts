// Centralized constants shared across the app.

export const SITE = {
  name: "Ready Go",
  tagline: "Explore Ooty with Ease",
  description:
    "Reliable, transparent and tourist-friendly cab service in Ooty. Book local sightseeing, airport transfers, tea-estate tours and family trips with a trusted family-run fleet.",
  phone: process.env.NEXT_PUBLIC_PHONE || "9345653427",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919345653427",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "https://instagram.com/",
  location: "Ooty, Tamil Nadu, India",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${SITE.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

// Vehicle status — single source of truth (shared by models, portal and public site).
export const VEHICLE_STATUSES = [
  "available",
  "busy",
  "on_trip",
  "off_duty",
  "maintenance",
  "leave",
] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export const VEHICLE_STATUS_META: Record<
  VehicleStatus,
  { label: string; tone: string; dot: string }
> = {
  available: { label: "Available", tone: "bg-brand-50 text-brand-700 border-brand-200", dot: "bg-brand-500" },
  on_trip: { label: "On Trip", tone: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  busy: { label: "Busy", tone: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  off_duty: { label: "Off Duty", tone: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" },
  maintenance: { label: "Maintenance", tone: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  leave: { label: "On Leave", tone: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-500" },
};

// Booking status — single source of truth.
export const BOOKING_STATUSES = ["new", "confirmed", "completed", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const BOOKING_STATUS_META: Record<BookingStatus, { label: string; tone: string }> = {
  new: { label: "New", tone: "bg-blue-50 text-blue-700 border-blue-200" },
  confirmed: { label: "Confirmed", tone: "bg-brand-50 text-brand-700 border-brand-200" },
  completed: { label: "Completed", tone: "bg-slate-100 text-slate-600 border-slate-200" },
  cancelled: { label: "Cancelled", tone: "bg-red-50 text-red-700 border-red-200" },
};

// Vehicle categories offered to customers.
export const VEHICLE_CATEGORIES = ["Hatchback", "Sedan", "SUV", "Tempo Traveller"] as const;
export type VehicleCategory = (typeof VEHICLE_CATEGORIES)[number];

export const USER_ROLES = ["admin", "driver"] as const;
export type UserRole = (typeof USER_ROLES)[number];

// ── Fixed trip packages ────────────────────────────────────────
// Pricing is package-based (not distance-based). Packages are a fixed set;
// the *price* for each package is set per vehicle by the admin (see the
// Vehicle model's `packagePrices`), so adding a vehicle means entering a price
// for every package below.
export const PACKAGES = [
  { id: "ooty", name: "Ooty Sightseeing", desc: "Full-day local Ooty sightseeing." },
  { id: "coonoor", name: "Coonoor", desc: "Coonoor sightseeing trip." },
  { id: "pykara", name: "Pykara", desc: "Pykara lake, falls & waterfalls." },
  { id: "pykara-mudumalai", name: "Pykara + Mudumalai", desc: "Pykara with Mudumalai wildlife sanctuary." },
  { id: "ooty-avalanche", name: "Ooty + Avalanche", desc: "Ooty sightseeing with Avalanche lake." },
  { id: "ooty-cbe-railway", name: "Ooty ⇄ Coimbatore Railway Station", desc: "Transfer either way — pickup or drop." },
  { id: "ooty-cbe-airport", name: "Ooty ⇄ Coimbatore Airport", desc: "Transfer either way — pickup or drop." },
  { id: "inside-ooty", name: "Inside Ooty (Point to Point)", desc: "One-way local drop within Ooty town." },
] as const;
export type PackageId = (typeof PACKAGES)[number]["id"];

// Zod-friendly tuple of ids for enum validation.
export const PACKAGE_IDS = PACKAGES.map((p) => p.id) as [PackageId, ...PackageId[]];

export function getPackage(id: string) {
  return PACKAGES.find((p) => p.id === id);
}

/** Normalize a stored packagePrices value (Mongoose Map or lean object) to a plain object. */
export function toPriceMap(prices: unknown): Record<string, number> {
  if (!prices) return {};
  if (prices instanceof Map) return Object.fromEntries(prices) as Record<string, number>;
  return prices as Record<string, number>;
}

// Default fare assumptions used when no specific vehicle is selected yet.
export const DEFAULT_FARE = {
  baseFare: 250, // INR
  pricePerKm: 18, // INR / km
  currency: "INR",
};
