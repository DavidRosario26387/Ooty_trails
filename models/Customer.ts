import { Schema, model, models, type Model, type Types } from "mongoose";

export interface ICustomer {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  bookingCount: number;
  lastBookingAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    bookingCount: { type: Number, default: 0 },
    lastBookingAt: { type: Date },
  },
  { timestamps: true },
);

export const Customer: Model<ICustomer> =
  models.Customer || model<ICustomer>("Customer", CustomerSchema);
