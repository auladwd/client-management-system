import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Client } from "@/models/Client";
import { CredentialVault } from "@/models/CredentialVault";
import { Payment } from "@/models/Payment";
import { store } from "@/lib/store";
import { encryptData } from "@/lib/encryption";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase();
    const district = searchParams.get("district");
    const status = searchParams.get("status");
    const appType = searchParams.get("appType");

    const mongoose = await connectToDatabase();

    if (mongoose) {
      const query: Record<string, unknown> = {};
      if (district) query.district = district;
      if (status) query.status = status;
      if (appType) query.appType = appType;
      if (q) {
        query.$or = [
          { name: { $regex: q, $options: "i" } },
          { ownerName: { $regex: q, $options: "i" } },
          { phone: { $regex: q, $options: "i" } },
          { email: { $regex: q, $options: "i" } },
        ];
      }
      const clients = await Client.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: clients });
    }

    // Fallback store
    let filtered = [...store.clients];
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.ownerName.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }
    if (district) {
      filtered = filtered.filter((c) => c.district.toLowerCase() === district.toLowerCase());
    }
    if (status) {
      filtered = filtered.filter((c) => c.status === status);
    }
    if (appType) {
      filtered = filtered.filter((c) => c.appType === appType);
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("GET /api/clients error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      ownerName,
      phone,
      email,
      division,
      district,
      upazila,
      appType,
      vercelUrl,
      customDomain,
      githubRepo,
      notes,
      assignedRepCode,
      // Optional initial credentials
      credentials,
      // Optional initial payment
      totalAmount,
      advanceAmount,
    } = body;

    if (!name || !phone || !email || !appType || !vercelUrl) {
      return NextResponse.json(
        { success: false, error: "Required fields missing" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();

    if (mongoose) {
      const client = await Client.create({
        name,
        ownerName: ownerName || name,
        phone,
        email,
        division: division || "Dhaka",
        district: district || "Dhaka",
        upazila: upazila || "Savar",
        appType,
        vercelUrl,
        customDomain: customDomain || "",
        githubRepo: githubRepo || "",
        notes: notes || "",
        assignedRepCode: assignedRepCode || "",
        status: "in_progress",
      });

      // Auto-initialize Vault in MongoDB
      const enc = encryptData(credentials || {
        gmailPassword: "",
        mongodbUri: "",
        firebaseProjectId: "",
        cloudinaryCloudName: "",
        vercelProjectId: "",
        notes: "Auto-generated vault entry",
      });

      await CredentialVault.create({
        clientId: client._id.toString(),
        clientName: name,
        dedicatedEmail: email,
        recoveryEmail: "aulad.recovery@gmail.com",
        recoveryPhone: "01700000000",
        encryptedData: enc.encryptedData,
        iv: enc.iv,
        authTag: enc.authTag,
      });

      // Auto-initialize Payment in MongoDB
      const tot = Number(totalAmount) || 20000;
      const adv = Number(advanceAmount) || 0;
      const invCount = await Payment.countDocuments();
      let invNumber = `INV-${new Date().getFullYear()}-${String(invCount + 1).padStart(3, "0")}`;
      if (await Payment.findOne({ invoiceNumber: invNumber })) {
        invNumber = `INV-${new Date().getFullYear()}-${String(invCount + 1).padStart(3, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
      }

      await Payment.create({
        clientId: client._id.toString(),
        clientName: name,
        invoiceNumber: invNumber,
        totalAmount: tot,
        paidAmount: adv,
        dueAmount: Math.max(0, tot - adv),
        status: adv >= tot ? "paid" : adv > 0 ? "partial" : "unpaid",
        installments: adv > 0 ? [
          {
            id: `inst-${Date.now()}`,
            date: new Date().toISOString().split("T")[0],
            amount: adv,
            method: "bKash",
            trxId: "INITIAL-ADV",
            note: "বুকিং এডভান্স",
          }
        ] : [],
      });

      return NextResponse.json({ success: true, data: client });
    }

    // In-memory fallback store
    const newId = `client-${Date.now()}`;
    const newClient = {
      _id: newId,
      name,
      ownerName,
      phone,
      email,
      division: division || "Dhaka",
      district: district || "Dhaka",
      upazila: upazila || "Savar",
      appType,
      vercelUrl,
      customDomain: customDomain || "",
      githubRepo: githubRepo || "",
      status: "in_progress" as const,
      notes: notes || "",
      assignedRepCode: assignedRepCode || "",
      createdAt: new Date().toISOString(),
    };

    store.clients.unshift(newClient);

    // Also auto-initialize Vault
    const enc = encryptData(credentials || {
      gmailPassword: "",
      mongodbUri: "",
      firebaseProjectId: "",
      cloudinaryCloudName: "",
      vercelProjectId: "",
      notes: "Auto-generated vault entry",
    });

    store.vaults.push({
      _id: `vault-${Date.now()}`,
      clientId: newId,
      clientName: name,
      dedicatedEmail: email,
      recoveryEmail: "aulad.recovery@gmail.com",
      recoveryPhone: "01700000000",
      encryptedData: enc.encryptedData,
      iv: enc.iv,
      authTag: enc.authTag,
      updatedAt: new Date().toISOString(),
    });

    // Also auto-initialize Payment record
    const tot = Number(totalAmount) || 20000;
    const adv = Number(advanceAmount) || 0;
    store.payments.push({
      _id: `pay-${Date.now()}`,
      clientId: newId,
      clientName: name,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(store.payments.length + 1).padStart(3, "0")}`,
      totalAmount: tot,
      paidAmount: adv,
      dueAmount: Math.max(0, tot - adv),
      status: adv >= tot ? "paid" : adv > 0 ? "partial" : "unpaid",
      installments: adv > 0 ? [
        {
          id: `inst-${Date.now()}`,
          date: new Date().toISOString().split("T")[0],
          amount: adv,
          method: "bKash",
          trxId: "INITIAL-ADV",
          note: "বুকিং এডভান্স",
        }
      ] : [],
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: newClient });
  } catch (error) {
    console.error("POST /api/clients error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
