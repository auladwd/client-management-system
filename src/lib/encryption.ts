import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const DEFAULT_SECRET = "aulad-it-solution-ultra-secure-vault-key-32-chars!!";

function getSecretKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || DEFAULT_SECRET;
  // Ensure the key is exactly 32 bytes
  return crypto.createHash("sha256").update(String(secret)).digest();
}

export interface EncryptedPayload {
  encryptedData: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypt any object or string using AES-256-GCM
 */
export function encryptData(data: Record<string, unknown> | string): EncryptedPayload {
  const key = getSecretKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const textToEncrypt = typeof data === "string" ? data : JSON.stringify(data);
  let encrypted = cipher.update(textToEncrypt, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return {
    encryptedData: encrypted,
    iv: iv.toString("hex"),
    authTag: authTag,
  };
}

/**
 * Decrypt payload encrypted with AES-256-GCM
 */
export function decryptData<T = Record<string, unknown>>(payload: EncryptedPayload): T | null {
  try {
    const key = getSecretKey();
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(payload.iv, "hex")
    );
    decipher.setAuthTag(Buffer.from(payload.authTag, "hex"));

    let decrypted = decipher.update(payload.encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    try {
      return JSON.parse(decrypted) as T;
    } catch {
      return decrypted as unknown as T;
    }
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
