import mongoose, { Schema, Document } from "mongoose";

export interface IBroadcast extends Document {
  title: string;
  message: string;
  targetAudience: "all" | "division" | "district";
  targetValue?: string;
  channel: "whatsapp" | "telegram" | "in_app";
  sentAt: string;
  recipientsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BroadcastSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    targetAudience: { type: String, enum: ["all", "division", "district"], default: "all" },
    targetValue: { type: String, default: "" },
    channel: { type: String, enum: ["whatsapp", "telegram", "in_app"], default: "whatsapp" },
    sentAt: { type: String, required: true },
    recipientsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Broadcast =
  mongoose.models.Broadcast ||
  mongoose.model<IBroadcast>("Broadcast", BroadcastSchema);
