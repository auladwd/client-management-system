import mongoose, { Schema, Document } from "mongoose";

export interface IInstallment {
  id: string;
  date: string;
  amount: number;
  method: "bKash" | "Nagad" | "Rocket" | "Bank" | "Cash";
  trxId: string;
  note?: string;
}

export interface IPayment extends Document {
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: "paid" | "partial" | "unpaid";
  installments: IInstallment[];
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InstallmentSchema = new Schema({
  id: { type: String, required: true },
  date: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["bKash", "Nagad", "Rocket", "Bank", "Cash"], default: "bKash" },
  trxId: { type: String, default: "" },
  note: { type: String, default: "" },
});

const PaymentSchema: Schema = new Schema(
  {
    clientId: { type: String, required: true },
    clientName: { type: String, required: true },
    invoiceNumber: { type: String, required: true, unique: true },
    totalAmount: { type: Number, required: true, default: 0 },
    paidAmount: { type: Number, required: true, default: 0 },
    dueAmount: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["paid", "partial", "unpaid"],
      default: "unpaid",
    },
    installments: [InstallmentSchema],
    dueDate: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Payment =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
