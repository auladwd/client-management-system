import mongoose, { Schema, Document } from "mongoose";

export interface IRepresentative extends Document {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  division: string;
  district: string;
  upazila: string;
  nidNumber: string;
  nidPhotoUrl?: string;
  repCode: string;
  commissionType: "fixed" | "percentage";
  commissionValue: number;
  totalSalesCount: number;
  totalCommissionEarned: number;
  commissionPaid: number;
  commissionDue: number;
  payoutMethod: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const RepresentativeSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String, default: "" },
    division: { type: String, required: true },
    district: { type: String, required: true },
    upazila: { type: String, required: true },
    nidNumber: { type: String, default: "" },
    nidPhotoUrl: { type: String, default: "" },
    repCode: { type: String, required: true, unique: true },
    commissionType: { type: String, enum: ["fixed", "percentage"], default: "fixed" },
    commissionValue: { type: Number, default: 1000 },
    totalSalesCount: { type: Number, default: 0 },
    totalCommissionEarned: { type: Number, default: 0 },
    commissionPaid: { type: Number, default: 0 },
    commissionDue: { type: Number, default: 0 },
    payoutMethod: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const Representative =
  mongoose.models.Representative ||
  mongoose.model<IRepresentative>("Representative", RepresentativeSchema);
