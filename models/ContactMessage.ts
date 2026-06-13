import { Schema, model, models, type Model, type Types } from "mongoose";

export interface IContactMessage {
  _id: Types.ObjectId;
  name: string;
  phone: string;
  email?: string;
  message: string;
  handled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessage>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    message: { type: String, required: true, trim: true },
    handled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ContactMessage: Model<IContactMessage> =
  models.ContactMessage || model<IContactMessage>("ContactMessage", ContactMessageSchema);
