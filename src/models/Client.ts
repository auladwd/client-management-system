import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  upazila: string;
  appType: string;
  vercelUrl: string;
  customDomain?: string;
  githubRepo?: string;
  status: "active" | "in_progress" | "maintenance" | "suspended";
  notes?: string;
  assignedRepCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    upazila: { type: String, required: true },
    appType: { type: String, required: true },
    vercelUrl: { type: String, required: true },
    customDomain: { type: String, default: "" },
    githubRepo: { type: String, default: "" },
    status: {
      type: String,
      enum: ["active", "in_progress", "maintenance", "suspended"],
      default: "in_progress",
    },
    notes: { type: String, default: "" },
    assignedRepCode: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Client =
  mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
