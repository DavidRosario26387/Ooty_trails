import { Schema, model, models, type Model, type Types } from "mongoose";
import { USER_ROLES } from "@/lib/constants";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "driver";
  phone?: string;
  assignedVehicle?: Types.ObjectId | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: USER_ROLES, required: true },
    phone: { type: String, trim: true },
    assignedVehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const User: Model<IUser> = models.User || model<IUser>("User", UserSchema);
