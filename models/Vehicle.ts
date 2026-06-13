import { Schema, model, models, type Model, type Types } from "mongoose";
import { VEHICLE_STATUSES, VEHICLE_CATEGORIES } from "@/lib/constants";

export interface IVehicle {
  _id: Types.ObjectId;
  name: string;
  type: string; // e.g. "Toyota Etios", "Mahindra Xylo"
  category: string; // Hatchback | Sedan | SUV | Tempo Traveller
  seatingCapacity: number;
  registrationNumber: string;
  assignedDriver?: Types.ObjectId | null;
  driverPhone?: string;
  pricePerKm: number;
  baseFare: number;
  image?: string;
  status: (typeof VEHICLE_STATUSES)[number];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    category: { type: String, enum: VEHICLE_CATEGORIES, required: true },
    seatingCapacity: { type: Number, required: true, min: 1 },
    registrationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    assignedDriver: { type: Schema.Types.ObjectId, ref: "User", default: null },
    driverPhone: { type: String, trim: true },
    pricePerKm: { type: Number, required: true, min: 0 },
    baseFare: { type: Number, required: true, min: 0 },
    image: { type: String, trim: true },
    status: { type: String, enum: VEHICLE_STATUSES, default: "available" },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Vehicle: Model<IVehicle> =
  models.Vehicle || model<IVehicle>("Vehicle", VehicleSchema);
