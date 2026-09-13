import mongoose, { Schema, Document } from "mongoose";

export interface IMaintenanceLog extends Document {
  clientId: string;
  clientName: string;
  issueTitle: string;
  description: string;
  severity: "low" | "medium" | "critical";
  status: "pending" | "in_progress" | "resolved";
  solutionNotes?: string;
  screenshotUrl?: string;
  reportedAt: string;
  resolvedAt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceLogSchema: Schema = new Schema(
  {
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    issueTitle: { type: String, required: true },
    description: { type: String, required: true },
    severity: {
      type: String,
      enum: ["low", "medium", "critical"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },
    solutionNotes: { type: String, default: "" },
    screenshotUrl: { type: String, default: "" },
    reportedAt: { type: String, required: true },
    resolvedAt: { type: String, default: "" },
  },
  { timestamps: true }
);

export const MaintenanceLog =
  mongoose.models.MaintenanceLog ||
  mongoose.model<IMaintenanceLog>("MaintenanceLog", MaintenanceLogSchema);
