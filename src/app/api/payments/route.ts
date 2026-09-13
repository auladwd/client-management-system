import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Payment } from "@/models/Payment";
import { store } from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");

    const mongoose = await connectToDatabase();

    if (mongoose) {
      const query: Record<string, unknown> = {};
      if (clientId) query.clientId = clientId;
      if (status) query.status = status;
      const payments = await Payment.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: payments });
    }

    let filtered = [...store.payments];
    if (clientId) {
      filtered = filtered.filter((p) => p.clientId === clientId);
    }
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientId,
      clientName,
      totalAmount,
      installment, // { amount, method, trxId, note, date }
      dueDate,
    } = body;

    const mongoose = await connectToDatabase();

    if (mongoose) {
      let record = await Payment.findOne({ clientId });
      if (!record) {
        const inv = `INV-${new Date().getFullYear()}-${String(await Payment.countDocuments() + 1).padStart(3, "0")}`;
        record = new Payment({
          clientId,
          clientName,
          invoiceNumber: inv,
          totalAmount: totalAmount || 20000,
          paidAmount: 0,
          dueAmount: totalAmount || 20000,
          status: "unpaid",
          installments: [],
          dueDate: dueDate || "",
        });
      }

      if (installment && installment.amount > 0) {
        const instObj = {
          id: `inst-${Date.now()}`,
          date: installment.date || new Date().toISOString().split("T")[0],
          amount: Number(installment.amount),
          method: installment.method || "bKash",
          trxId: installment.trxId || "",
          note: installment.note || "",
        };
        record.installments.push(instObj);
        record.paidAmount += Number(installment.amount);
        record.dueAmount = Math.max(0, record.totalAmount - record.paidAmount);
        record.status = record.paidAmount >= record.totalAmount ? "paid" : "partial";
      }

      await record.save();
      return NextResponse.json({ success: true, data: record });
    }

    // In-memory fallback
    let record = store.payments.find((p) => p.clientId === clientId);
    if (!record) {
      const inv = `INV-${new Date().getFullYear()}-${String(store.payments.length + 1).padStart(3, "0")}`;
      record = {
        _id: `pay-${Date.now()}`,
        clientId,
        clientName: clientName || "Client App",
        invoiceNumber: inv,
        totalAmount: Number(totalAmount) || 20000,
        paidAmount: 0,
        dueAmount: Number(totalAmount) || 20000,
        status: "unpaid",
        installments: [],
        dueDate: dueDate || "",
        createdAt: new Date().toISOString(),
      };
      store.payments.push(record);
    }

    if (installment && installment.amount > 0) {
      const instObj = {
        id: `inst-${Date.now()}`,
        date: installment.date || new Date().toISOString().split("T")[0],
        amount: Number(installment.amount),
        method: installment.method || "bKash",
        trxId: installment.trxId || "",
        note: installment.note || "",
      };
      record.installments.push(instObj);
      record.paidAmount += Number(installment.amount);
      record.dueAmount = Math.max(0, record.totalAmount - record.paidAmount);
      record.status = record.paidAmount >= record.totalAmount ? "paid" : "partial";
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
