import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CredentialVault } from "@/models/CredentialVault";
import { store } from "@/lib/store";
import { encryptData, decryptData } from "@/lib/encryption";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const shouldDecrypt = searchParams.get("decrypt") === "true";

    const mongoose = await connectToDatabase();

    if (mongoose) {
      const query = clientId ? { clientId } : {};
      const vaults = await CredentialVault.find(query);

      const mapped = vaults.map((v) => {
        const item = v.toObject();
        if (shouldDecrypt) {
          item.decrypted = decryptData({
            encryptedData: item.encryptedData,
            iv: item.iv,
            authTag: item.authTag,
          });
        }
        return item;
      });

      return NextResponse.json({ success: true, data: clientId ? mapped[0] || null : mapped });
    }

    // In-memory fallback
    if (clientId) {
      const vault = store.vaults.find((v) => v.clientId === clientId);
      if (!vault) {
        return NextResponse.json({ success: true, data: null });
      }
      const copy = { ...vault } as Record<string, unknown>;
      if (shouldDecrypt) {
        copy.decrypted = decryptData({
          encryptedData: vault.encryptedData,
          iv: vault.iv,
          authTag: vault.authTag,
        });
      }
      return NextResponse.json({ success: true, data: copy });
    }

    const all = store.vaults.map((v) => {
      const copy = { ...v } as Record<string, unknown>;
      if (shouldDecrypt) {
        copy.decrypted = decryptData({
          encryptedData: v.encryptedData,
          iv: v.iv,
          authTag: v.authTag,
        });
      }
      return copy;
    });

    return NextResponse.json({ success: true, data: all });
  } catch (error) {
    console.error("GET /api/vault error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientId,
      clientName,
      dedicatedEmail,
      recoveryEmail,
      recoveryPhone,
      credentials, // Raw object to encrypt
    } = body;

    if (!clientId || !dedicatedEmail) {
      return NextResponse.json(
        { success: false, error: "Client ID and Dedicated Email are required" },
        { status: 400 }
      );
    }

    // Encrypt credentials payload
    const enc = encryptData(credentials || {});

    const mongoose = await connectToDatabase();

    if (mongoose) {
      const updated = await CredentialVault.findOneAndUpdate(
        { clientId },
        {
          clientId,
          clientName: clientName || "Client App",
          dedicatedEmail,
          recoveryEmail: recoveryEmail || "",
          recoveryPhone: recoveryPhone || "",
          encryptedData: enc.encryptedData,
          iv: enc.iv,
          authTag: enc.authTag,
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({ success: true, data: updated });
    }

    // In-memory fallback
    const idx = store.vaults.findIndex((v) => v.clientId === clientId);
    const newEntry = {
      _id: idx !== -1 ? store.vaults[idx]._id : `vault-${Date.now()}`,
      clientId,
      clientName: clientName || "Client App",
      dedicatedEmail,
      recoveryEmail: recoveryEmail || "",
      recoveryPhone: recoveryPhone || "",
      encryptedData: enc.encryptedData,
      iv: enc.iv,
      authTag: enc.authTag,
      updatedAt: new Date().toISOString(),
    };

    if (idx !== -1) {
      store.vaults[idx] = newEntry;
    } else {
      store.vaults.push(newEntry);
    }

    return NextResponse.json({ success: true, data: newEntry });
  } catch (error) {
    console.error("POST /api/vault error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
