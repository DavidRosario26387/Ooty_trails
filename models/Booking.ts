import { Schema, model, models, type Model, type Types } from "mongoose";
import { BOOKING_STATUSES } from "@/lib/constants";

export interface IBooking {
  _id: Types.ObjectId;
  bookingRef: string;
  customerName: string;
  phone: string;
  email?: string;
  pickup: string;
  drop?: string;
  travelDate: string; // ISO date (YYYY-MM-DD)
  travelTime: string; // HH:mm
  passengers: number;
  packageId: string;
  packageName: string; // snapshot of the package name at booking time
  vehicleId: Types.ObjectId; // the vehicle the customer chose (sets the price)
  vehicleName: string; // snapshot of the vehicle name at booking time
  fare: number; // fixed package price for the chosen vehicle
  notes?: string;
  status: (typeof BOOKING_STATUSES)[number];
  assignedVehicle?: Types.ObjectId | null;
  assignedDriver?: Types.ObjectId | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingRef: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    pickup: { type: String, required: true, trim: true },
    drop: { type: String, trim: true },
    travelDate: { type: String, required: true },
    travelTime: { type: String, required: true },
    passengers: { type: Number, required: true, min: 1 },
    packageId: { type: String, required: true, trim: true },
    packageName: { type: String, required: true, trim: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    vehicleName: { type: String, required: true, trim: true },
    fare: { type: Number, required: true, min: 0 },
    notes: { type: String, trim: true },
    status: { type: String, enum: BOOKING_STATUSES, default: "new", index: true },
    assignedVehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", default: null },
    assignedDriver: { type: Schema.Types.ObjectId, ref: "User", default: null },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Booking: Model<IBooking> =
  models.Booking || model<IBooking>("Booking", BookingSchema);

/** Generate a human-friendly booking reference, e.g. OG-7K3F9A. */
export function generateBookingRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `OG-${code}`;
}
