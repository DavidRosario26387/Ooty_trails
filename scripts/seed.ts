/**
 * Seed script — creates the first admin, sample drivers and ~7 vehicles.
 *
 * Run with:  npm run seed
 * Reads MONGODB_URI, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD from .env.local / .env.
 *
 * Safe to re-run: it upserts by unique keys (email / registration number) and
 * won't create duplicates.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Vehicle } from "@/models/Vehicle";

const ADMIN_EMAIL = (process.env.ADMIN_SEED_EMAIL || "admin@ootygo.in").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD || "ChangeMe123!";

const DRIVERS = [
  { name: "Ravi Kumar", email: "driver1@ooty.in", phone: "9345600001" },
  { name: "Suresh M", email: "driver2@ooty.in", phone: "9345600002" },
  { name: "Karthik R", email: "driver3@ooty.in", phone: "9345600003" },
  { name: "Manoj S", email: "driver4@ooty.in", phone: "9345600004" },
];

// Free Unsplash stock photos as attractive placeholders (replace via admin portal later).
const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

const VEHICLES = [
  { name: "Etios",     type: "Toyota Etios",     category: "Sedan",            seatingCapacity: 4,  registrationNumber: "TN43A0001", pricePerKm: 16, baseFare: 250, status: "available",   image: u("photo-1569433295058-aaa6338e25c4") },
  { name: "Dzire",     type: "Maruti Dzire",     category: "Sedan",            seatingCapacity: 4,  registrationNumber: "TN43A0002", pricePerKm: 16, baseFare: 250, status: "available",   image: u("photo-1622480916060-33f87e3e6700") },
  { name: "Swift", type: "Maruti Swift",     category: "Hatchback",        seatingCapacity: 4,  registrationNumber: "TN43A0003", pricePerKm: 13, baseFare: 200, status: "available",   image: u("photo-1560207218-c1f79592e215") },
  { name: "Xylo",     type: "Mahindra Xylo",    category: "SUV",              seatingCapacity: 7,  registrationNumber: "TN43A0004", pricePerKm: 20, baseFare: 350, status: "on_trip",     image: u("photo-1758411898280-2dc7c95e0ba7") },
  { name: "Innova", type: "Toyota Innova",    category: "SUV",              seatingCapacity: 7,  registrationNumber: "TN43A0005", pricePerKm: 22, baseFare: 400, status: "available",   image: u("photo-1622210642960-0f6a2cdbdc9f") },
  { name: "Ertiga",    type: "Maruti Ertiga",    category: "SUV",              seatingCapacity: 6,  registrationNumber: "TN43A0006", pricePerKm: 18, baseFare: 300, status: "maintenance", image: u("photo-1639280792738-2a4c5e5d5685") },
  { name: "Group Tempo",   type: "Force Traveller",  category: "Tempo Traveller",  seatingCapacity: 12, registrationNumber: "TN43A0007", pricePerKm: 28, baseFare: 600, status: "available",   image: u("photo-1534011056808-50c1c6082fe7") },
];

async function run() {
  await connectDB();
  console.log("Connected to MongoDB.");

  // Admin
  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.findOneAndUpdate(
    { email: ADMIN_EMAIL },
    { $set: { name: "Ooty Trails Admin", role: "admin", active: true }, $setOnInsert: { passwordHash: adminHash } },
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

  // Vehicles + assign first few drivers
  const driverEmails = DRIVERS.map((d) => d.email);
  for (let i = 0; i < VEHICLES.length; i++) {
    const v = VEHICLES[i];
    const assignedEmail = driverEmails[i]; // first N vehicles get a driver
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
  console.log(`${VEHICLES.length} vehicles ready.`);

  console.log("\n✅ Seed complete.");
  console.log("   Admin login : ", ADMIN_EMAIL, "/", ADMIN_PASSWORD);
  console.log("   Driver login: driver1@ooty.in / driver123 (assigned to KBN Etios)");

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
