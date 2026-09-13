import mongoose, { Schema, Document } from "mongoose";

export interface DecryptedCredentials {
  gmailPassword?: string;
  mongodbUri?: string;
  mongodbUser?: string;
  mongodbPassword?: string;
  firebaseProjectId?: string;
  firebaseApiKey?: string;
  firebaseAuthDomain?: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;
  vercelProjectId?: string;
  vercelToken?: string;
  notes?: string;
}

export interface ICredentialVault extends Document {
  clientId: string;
  clientName: string;
  dedicatedEmail: string;
  recoveryEmail?: string;
  recoveryPhone?: string;
  encryptedData: string;
  iv: string;
  authTag: string;
  createdAt: Date;
  updatedAt: Date;
}

const CredentialVaultSchema: Schema = new Schema(
  {
    clientId: { type: String, required: true, unique: true },
    clientName: { type: String, required: true },
    dedicatedEmail: { type: String, required: true },
    recoveryEmail: { type: String, default: "" },
    recoveryPhone: { type: String, default: "" },
    encryptedData: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
  },
  { timestamps: true }
);

export const CredentialVault =
  mongoose.models.CredentialVault ||
  mongoose.model<ICredentialVault>("CredentialVault", CredentialVaultSchema);
