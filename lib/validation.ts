import { z } from "zod";
import {
  VEHICLE_STATUSES,
  VEHICLE_CATEGORIES,
  BOOKING_STATUSES,
  USER_ROLES,
} from "@/lib/constants";

const phone = z
  .string()
  .trim()
  .regex(/^[0-9+\-\s()]{7,15}$/, "Enter a valid phone number");

// ── Public ─────────────────────────────────────────────────────
export const estimateSchema = z.object({
  pickup: z.string().trim().min(2, "Pickup is required"),
  drop: z.string().trim().min(2, "Drop is required"),
  vehiclePreference: z.string().trim().optional(),
});
export type EstimateInput = z.infer<typeof estimateSchema>;

export const bookingSchema = z.object({
  customerName: z.string().trim().min(2, "Name is required"),
  phone,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  pickup: z.string().trim().min(2, "Pickup is required"),
  drop: z.string().trim().min(2, "Drop is required"),
  travelDate: z.string().min(1, "Travel date is required"),
  travelTime: z.string().min(1, "Travel time is required"),
  passengers: z.coerce.number().int().min(1).max(20),
  vehiclePreference: z.string().trim().optional(),
  notes: z.string().trim().max(1000).optional(),
});
export type BookingInput = z.infer<typeof bookingSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  message: z.string().trim().min(5, "Message is too short").max(2000),
});
export type ContactInput = z.infer<typeof contactSchema>;

// ── Auth ───────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password is too short"),
});

// ── Admin: vehicles ────────────────────────────────────────────
export const vehicleSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  type: z.string().trim().min(1, "Type is required"),
  category: z.enum(VEHICLE_CATEGORIES),
  seatingCapacity: z.coerce.number().int().min(1).max(30),
  registrationNumber: z.string().trim().min(3, "Registration number is required"),
  assignedDriver: z.string().trim().optional().nullable(),
  driverPhone: z.string().trim().optional(),
  pricePerKm: z.coerce.number().min(0),
  baseFare: z.coerce.number().min(0),
  image: z.string().trim().optional(),
  status: z.enum(VEHICLE_STATUSES).optional(),
});

export const vehicleUpdateSchema = vehicleSchema.partial();

// ── Admin: drivers ─────────────────────────────────────────────
export const driverSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().trim().optional(),
  assignedVehicle: z.string().trim().optional().nullable(),
});

export const driverUpdateSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional(),
  password: z.string().min(6).optional().or(z.literal("")),
  assignedVehicle: z.string().trim().optional().nullable(),
  active: z.boolean().optional(),
});

// ── Admin: bookings ────────────────────────────────────────────
export const bookingUpdateSchema = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
  assignedVehicle: z.string().trim().optional().nullable(),
  assignedDriver: z.string().trim().optional().nullable(),
});

// ── Driver: status ─────────────────────────────────────────────
export const driverStatusSchema = z.object({
  status: z.enum(VEHICLE_STATUSES),
});

export const roleSchema = z.enum(USER_ROLES);
