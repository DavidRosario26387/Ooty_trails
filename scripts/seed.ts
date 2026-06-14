/**
 * Seed script — creates the first admin, drivers and the two vehicles.
 *
 * Run with:  npm run seed          (safe — upserts, keeps existing data)
 *            npm run seed:fresh    (WIPES all app data first, then seeds)
 *
 * Reads MONGODB_URI, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD from .env.local / .env.
 *
 * Plain `seed` is safe to re-run: it upserts by unique keys (email / registration
 * number) and won't create duplicates. `seed:fresh` clears bookings, customers,
 * messages, vehicles and users so you can start from a clean slate.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";
import { Booking } from "@/models/Booking";
import { Customer } from "@/models/Customer";
import { ContactMessage } from "@/models/ContactMessage";

const FRESH = process.argv.includes("--fresh");

const ADMIN_EMAIL = (process.env.ADMIN_SEED_EMAIL || "admin@ootygo.in").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD || "ChangeMe123!";

const DRIVERS = [
  { name: "Ravi Kumar", email: "driver1@ooty.in", phone: "9345600001" },
  { name: "Suresh M", email: "driver2@ooty.in", phone: "9345600002" },
];

// Free Unsplash stock photos as attractive placeholders (replace via admin portal later).
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

// We run exactly two vehicles: a car (Etios) and an SUV (Xylo).
// Pricing is package-based — each vehicle has a fixed price per package.
const ETIOS_PRICES = {
  ooty: 2500, coonoor: 3000, pykara: 3000, "pykara-mudumalai": 4000,
  "ooty-avalanche": 3000, "ooty-cbe-railway": 3500, "ooty-cbe-airport": 3500, "inside-ooty": 1000,
};
const XYLO_PRICES = {
  ooty: 3000, coonoor: 3500, pykara: 3500, "pykara-mudumalai": 4500,
  "ooty-avalanche": 3500, "ooty-cbe-railway": 4500, "ooty-cbe-airport": 4500, "inside-ooty": 1500,
};

const VEHICLES = [
  { name: "Etios", type: "Toyota Etios",  category: "Sedan", seatingCapacity: 4, registrationNumber: "TN43A0001", packagePrices: ETIOS_PRICES, status: "available", image: u("photo-1569433295058-aaa6338e25c4") },
  { name: "Xylo",  type: "Mahindra Xylo", category: "SUV",   seatingCapacity: 7, registrationNumber: "TN43A0002", packagePrices: XYLO_PRICES, status: "available", image: u("photo-1758411898280-2dc7c95e0ba7") },
];

async function run() {
  await connectDB();
  console.log("Connected to MongoDB.");

  if (FRESH) {
    await Promise.all([
      Booking.deleteMany({}),
      Customer.deleteMany({}),
      ContactMessage.deleteMany({}),
      Vehicle.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log("🧹 Cleared all app data (bookings, customers, messages, vehicles, users).");
  }

  // Admin
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    { $set: { name: "Ready Go Admin", role: "admin", active: true }, $setOnInsert: { passwordHash: adminHash } },
    { upsert: true },
  );
  console.log(`Admin ready: ${ADMIN_EMAIL} (password from ADMIN_SEED_PASSWORD)`);

  // Drivers (default password: driver123)
  const driverHash = await bcrypt.hash("driver123", 10);
  const driverIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const d of DRIVERS) {
    const doc = await User.findOneAndUpdate(
      { email: d.email },
      { $set: { name: d.name, role: "driver", phone: d.phone, active: true }, $setOnInsert: { passwordHash: driverHash } },
      { upsert: true, new: true },
    );
    driverIds[d.email] = doc!._id;
  }
  console.log(`${DRIVERS.length} drivers ready (default password: driver123)`);

  // Vehicles + assign one driver each
  const driverEmails = DRIVERS.map((d) => d.email);
  for (let i = 0; i < VEHICLES.length; i++) {
    const v = VEHICLES[i];
    const assignedEmail = driverEmails[i]; // each vehicle gets a driver
    const assignedDriver = assignedEmail ? driverIds[assignedEmail] : null;
    const driverPhone = assignedEmail ? DRIVERS[i].phone : undefined;

    const vehicle = await Vehicle.findOneAndUpdate(
      { registrationNumber: v.registrationNumber },
      { $set: { ...v, assignedDriver, driverPhone, active: true } },
      { upsert: true, new: true },
    );
    if (assignedDriver) {
      await User.findByIdAndUpdate(assignedDriver, { assignedVehicle: vehicle!._id });
    }
  }
  console.log(`${VEHICLES.length} vehicles ready (Etios, Xylo).`);

  console.log("\n✅ Seed complete.");
  console.log("   Admin login : ", ADMIN_EMAIL, "/", ADMIN_PASSWORD);
  console.log("   Driver login: driver1@ooty.in / driver123 (assigned to Etios)");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
