import mongoose, { Schema, Document } from "mongoose";

export interface IAllowedUser extends Document {
  email: string;
  name?: string;
  role: "superadmin" | "admin" | "manager" | "viewer";
  status: "active" | "inactive";
  addedBy: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AllowedUserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "" },
    role: {
      type: String,
      enum: ["superadmin", "admin", "manager", "viewer"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    addedBy: { type: String, default: "auladinfo@gmail.com" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export const AllowedUser =
  mongoose.models.AllowedUser || mongoose.model<IAllowedUser>("AllowedUser", AllowedUserSchema);
