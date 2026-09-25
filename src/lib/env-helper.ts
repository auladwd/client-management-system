export interface DecryptedCredentials {
  // MongoDB Atlas
  mongodbUri?: string;
  mongodbDbName?: string;
  mongodbUser?: string;
  mongodbPassword?: string;

  // Firebase
  firebaseApiKey?: string;
  firebaseAuthDomain?: string;
  firebaseProjectId?: string;
  firebaseStorageBucket?: string;
  firebaseMessagingSenderId?: string;
  firebaseAppId?: string;

  // Cloudinary
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  cloudinaryApiSecret?: string;

  // Dedicated Gmail / SMTP
  gmailPassword?: string;
  smtpHost?: string;
  smtpPort?: string;

  // Security & Authentication Secrets
  nextauthSecret?: string;
  nextauthUrl?: string;

  // Vercel Deployment
  vercelProjectId?: string;
  vercelOrgId?: string;
  vercelToken?: string;

  // SMS Gateway (Bangladesh Bulk SMS)
  smsApiKey?: string;
  smsSenderId?: string;

  // Payment Gateway
  paymentMerchantId?: string;
  paymentSecretKey?: string;

  // Extra Custom Variables & Notes
  customEnv?: string;
  notes?: string;
}

/**
 * Generates a clean, production-ready .env string directly usable in client apps.
 */
export function generateEnvContent(
  clientName: string,
  dedicatedEmail: string,
  creds: DecryptedCredentials = {}
): string {
  const dateStr = new Date().toISOString().replace("T", " ").slice(0, 19);
  const clean = (val?: string) => (val ? val.trim() : "");

  const firebaseAuthDomain =
    clean(creds.firebaseAuthDomain) ||
    (creds.firebaseProjectId ? `${creds.firebaseProjectId.trim()}.firebaseapp.com` : "");

  const firebaseStorage =
    clean(creds.firebaseStorageBucket) ||
    (creds.firebaseProjectId ? `${creds.firebaseProjectId.trim()}.appspot.com` : "");

  const sections: string[] = [];

  // Header
  sections.push(`# =================================================================
# AULAD IT SOLUTION - CLIENT ENVIRONMENT CONFIGURATION
# Client Application: ${clientName || "Client App"}
# Dedicated Service Email: ${dedicatedEmail || "client.service@gmail.com"}
# Generated At: ${dateStr}
# Format: Ready for Next.js, React, Node.js, Express, Vite
# =================================================================`);

  // 1. MongoDB Atlas Database
  sections.push(`# -----------------------------------------------------------------
# 1. MongoDB Atlas Database
# -----------------------------------------------------------------
MONGODB_URI="${clean(creds.mongodbUri)}"${
    creds.mongodbDbName ? `\nMONGODB_DB_NAME="${clean(creds.mongodbDbName)}"` : ""
  }`);

  // 2. Firebase Client & Admin Authentication
  sections.push(`# -----------------------------------------------------------------
# 2. Firebase Authentication & Storage
# -----------------------------------------------------------------
NEXT_PUBLIC_FIREBASE_API_KEY="${clean(creds.firebaseApiKey)}"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="${firebaseAuthDomain}"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="${clean(creds.firebaseProjectId)}"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="${firebaseStorage}"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="${clean(creds.firebaseMessagingSenderId)}"
NEXT_PUBLIC_FIREBASE_APP_ID="${clean(creds.firebaseAppId)}"`);

  // 3. Cloudinary Media Upload CDN
  const cName = clean(creds.cloudinaryCloudName);
  sections.push(`# -----------------------------------------------------------------
# 3. Cloudinary (Image, Video & Document Storage CDN)
# -----------------------------------------------------------------
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="${cName}"
CLOUDINARY_CLOUD_NAME="${cName}"
CLOUDINARY_API_KEY="${clean(creds.cloudinaryApiKey)}"
CLOUDINARY_API_SECRET="${clean(creds.cloudinaryApiSecret)}"`);

  // 4. Dedicated Gmail & SMTP Mailer
  sections.push(`# -----------------------------------------------------------------
# 4. Dedicated Gmail & SMTP Mail Service
# -----------------------------------------------------------------
GMAIL_USER="${clean(dedicatedEmail)}"
GMAIL_APP_PASSWORD="${clean(creds.gmailPassword)}"
SMTP_HOST="${clean(creds.smtpHost) || "smtp.gmail.com"}"
SMTP_PORT="${clean(creds.smtpPort) || "465"}"`);

  // 5. Security & Authentication Secrets
  if (creds.nextauthSecret || creds.nextauthUrl) {
    sections.push(`# -----------------------------------------------------------------
# 5. Security & Auth Secrets (NextAuth / JWT / Session)
# -----------------------------------------------------------------
NEXTAUTH_SECRET="${clean(creds.nextauthSecret)}"
AUTH_SECRET="${clean(creds.nextauthSecret)}"
NEXTAUTH_URL="${clean(creds.nextauthUrl) || "http://localhost:3000"}"`);
  }

  // 6. Vercel Deployment
  if (creds.vercelProjectId || creds.vercelOrgId || creds.vercelToken) {
    sections.push(`# -----------------------------------------------------------------
# 6. Vercel Edge & Cloud Deployment
# -----------------------------------------------------------------
VERCEL_PROJECT_ID="${clean(creds.vercelProjectId)}"
VERCEL_ORG_ID="${clean(creds.vercelOrgId)}"
VERCEL_TOKEN="${clean(creds.vercelToken)}"`);
  }

  // 7. SMS Gateway
  if (creds.smsApiKey || creds.smsSenderId) {
    sections.push(`# -----------------------------------------------------------------
# 7. SMS Gateway (Bangladesh Bulk SMS Service)
# -----------------------------------------------------------------
SMS_API_KEY="${clean(creds.smsApiKey)}"
SMS_SENDER_ID="${clean(creds.smsSenderId)}"`);
  }

  // 8. Payment Gateway
  if (creds.paymentMerchantId || creds.paymentSecretKey) {
    sections.push(`# -----------------------------------------------------------------
# 8. Payment Gateway (bKash / Nagad / SSLCommerz)
# -----------------------------------------------------------------
PAYMENT_MERCHANT_ID="${clean(creds.paymentMerchantId)}"
PAYMENT_SECRET_KEY="${clean(creds.paymentSecretKey)}"`);
  }

  // 9. Custom / Extra Variables
  if (creds.customEnv && creds.customEnv.trim()) {
    sections.push(`# -----------------------------------------------------------------
# 9. Additional Custom Environment Variables
# -----------------------------------------------------------------
${creds.customEnv.trim()}`);
  }

  // 10. Vault Notes (as comments)
  if (creds.notes && creds.notes.trim()) {
    sections.push(`# -----------------------------------------------------------------
# 10. Vault Notes & Security Remarks
# -----------------------------------------------------------------
# ${creds.notes.replace(/\r?\n/g, "\n# ")}`);
  }

  return sections.join("\n\n") + "\n";
}

/**
 * Downloads generated content as a .env or .env.local file in the user's browser.
 */
export function downloadEnvFile(
  content: string,
  filename: string = ".env.local"
): void {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copies the raw .env text to the clipboard.
 */
export async function copyEnvToClipboard(content: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    return false;
  }
}

/**
 * Parses raw .env file text into structured credentials object.
 * Great for importing existing .env files directly into the Vault!
 */
export function parseEnvText(envText: string): {
  creds: Partial<DecryptedCredentials>;
  detectedEmail?: string;
  unrecognizedLines: string[];
} {
  const creds: Partial<DecryptedCredentials> = {};
  let detectedEmail: string | undefined;
  const unrecognizedLines: string[] = [];

  const lines = envText.split(/\r?\n/);
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();

    // Strip quotes
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    switch (key) {
      // MongoDB
      case "MONGODB_URI":
      case "DATABASE_URL":
      case "MONGO_URL":
        creds.mongodbUri = val;
        break;
      case "MONGODB_DB_NAME":
      case "DB_NAME":
        creds.mongodbDbName = val;
        break;

      // Firebase
      case "NEXT_PUBLIC_FIREBASE_API_KEY":
      case "FIREBASE_API_KEY":
        creds.firebaseApiKey = val;
        break;
      case "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN":
      case "FIREBASE_AUTH_DOMAIN":
        creds.firebaseAuthDomain = val;
        break;
      case "NEXT_PUBLIC_FIREBASE_PROJECT_ID":
      case "FIREBASE_PROJECT_ID":
        creds.firebaseProjectId = val;
        break;
      case "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET":
      case "FIREBASE_STORAGE_BUCKET":
        creds.firebaseStorageBucket = val;
        break;
      case "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID":
      case "FIREBASE_MESSAGING_SENDER_ID":
        creds.firebaseMessagingSenderId = val;
        break;
      case "NEXT_PUBLIC_FIREBASE_APP_ID":
      case "FIREBASE_APP_ID":
        creds.firebaseAppId = val;
        break;

      // Cloudinary
      case "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME":
      case "CLOUDINARY_CLOUD_NAME":
        creds.cloudinaryCloudName = val;
        break;
      case "CLOUDINARY_API_KEY":
        creds.cloudinaryApiKey = val;
        break;
      case "CLOUDINARY_API_SECRET":
        creds.cloudinaryApiSecret = val;
        break;

      // Dedicated Gmail / SMTP
      case "GMAIL_USER":
      case "SMTP_USER":
      case "EMAIL_USER":
        detectedEmail = val;
        break;
      case "GMAIL_APP_PASSWORD":
      case "GMAIL_PASSWORD":
      case "SMTP_PASSWORD":
      case "SMTP_PASS":
        creds.gmailPassword = val;
        break;
      case "SMTP_HOST":
        creds.smtpHost = val;
        break;
      case "SMTP_PORT":
        creds.smtpPort = val;
        break;

      // Security / NextAuth
      case "NEXTAUTH_SECRET":
      case "AUTH_SECRET":
      case "ENCRYPTION_SECRET":
        creds.nextauthSecret = val;
        break;
      case "NEXTAUTH_URL":
        creds.nextauthUrl = val;
        break;

      // Vercel
      case "VERCEL_PROJECT_ID":
        creds.vercelProjectId = val;
        break;
      case "VERCEL_ORG_ID":
        creds.vercelOrgId = val;
        break;
      case "VERCEL_TOKEN":
        creds.vercelToken = val;
        break;

      // SMS
      case "SMS_API_KEY":
        creds.smsApiKey = val;
        break;
      case "SMS_SENDER_ID":
        creds.smsSenderId = val;
        break;

      // Payment
      case "PAYMENT_MERCHANT_ID":
      case "BKASH_APP_KEY":
        creds.paymentMerchantId = val;
        break;
      case "PAYMENT_SECRET_KEY":
      case "BKASH_APP_SECRET":
        creds.paymentSecretKey = val;
        break;

      default:
        unrecognizedLines.push(`${key}="${val}"`);
        break;
    }
  }

  if (unrecognizedLines.length > 0) {
    creds.customEnv = unrecognizedLines.join("\n");
  }

  return { creds, detectedEmail, unrecognizedLines };
}
