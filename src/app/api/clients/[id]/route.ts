import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Client } from "@/models/Client";
import { CredentialVault } from "@/models/CredentialVault";
import { Payment } from "@/models/Payment";
import { MaintenanceLog } from "@/models/MaintenanceLog";
import { store } from "@/lib/store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mongoose = await connectToDatabase();

    if (mongoose) {
      const client = await Client.findById(id);
      if (!client) {
        return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: client });
    }

    const client = store.clients.find((c) => c._id === id);
    if (!client) {
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: client });
  } catch (error) {
    console.error("GET /api/clients/[id] error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const mongoose = await connectToDatabase();

    if (mongoose) {
      const updated = await Client.findByIdAndUpdate(id, body, { new: true });
      return NextResponse.json({ success: true, data: updated });
    }

    const idx = store.clients.findIndex((c) => c._id === id);
    if (idx === -1) {
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
    }

    store.clients[idx] = {
      ...store.clients[idx],
      ...body,
    };

    return NextResponse.json({ success: true, data: store.clients[idx] });
  } catch (error) {
    console.error("PUT /api/clients/[id] error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mongoose = await connectToDatabase();

    if (mongoose) {
      await Client.findByIdAndDelete(id);
      await CredentialVault.deleteMany({ clientId: id });
      await Payment.deleteMany({ clientId: id });
      await MaintenanceLog.deleteMany({ clientId: id });
      return NextResponse.json({ success: true, message: "Client deleted" });
    }

    store.clients = store.clients.filter((c) => c._id !== id);
    store.vaults = store.vaults.filter((v) => v.clientId !== id);
    store.payments = store.payments.filter((p) => p.clientId !== id);
    store.maintenance = store.maintenance.filter((m) => m.clientId !== id);
    return NextResponse.json({ success: true, message: "Client deleted" });
  } catch (error) {
    console.error("DELETE /api/clients/[id] error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
