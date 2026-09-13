import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { MaintenanceLog } from "@/models/MaintenanceLog";
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
      const logs = await MaintenanceLog.find(query).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: logs });
    }

    let filtered = [...store.maintenance];
    if (clientId) {
      filtered = filtered.filter((m) => m.clientId === clientId);
    }
    if (status) {
      filtered = filtered.filter((m) => m.status === status);
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("GET /api/maintenance error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientId,
      clientName,
      issueTitle,
      description,
      severity,
      screenshotUrl,
    } = body;

    if (!clientId || !issueTitle) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();

    if (mongoose) {
      const log = await MaintenanceLog.create({
        clientId,
        clientName: clientName || "Client App",
        issueTitle,
        description: description || "",
        severity: severity || "medium",
        status: "pending",
        screenshotUrl: screenshotUrl || "",
        reportedAt: new Date().toISOString().split("T")[0],
      });
      return NextResponse.json({ success: true, data: log });
    }

    const newLog = {
      _id: `maint-${Date.now()}`,
      clientId,
      clientName: clientName || "Client App",
      issueTitle,
      description: description || "",
      severity: severity || ("medium" as const),
      status: "pending" as const,
      screenshotUrl: screenshotUrl || "",
      reportedAt: new Date().toISOString().split("T")[0],
    };

    store.maintenance.unshift(newLog);
    return NextResponse.json({ success: true, data: newLog });
  } catch (error) {
    console.error("POST /api/maintenance error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, solutionNotes } = body;

    const mongoose = await connectToDatabase();

    if (mongoose) {
      const updateData: Record<string, unknown> = {};
      if (status) updateData.status = status;
      if (solutionNotes !== undefined) updateData.solutionNotes = solutionNotes;
      if (status === "resolved") {
        updateData.resolvedAt = new Date().toISOString().split("T")[0];
      }

      const updated = await MaintenanceLog.findByIdAndUpdate(id, updateData, { new: true });
      return NextResponse.json({ success: true, data: updated });
    }

    const item = store.maintenance.find((m) => m._id === id);
    if (!item) {
      return NextResponse.json({ success: false, error: "Log not found" }, { status: 404 });
    }

    if (status) item.status = status;
    if (solutionNotes !== undefined) item.solutionNotes = solutionNotes;
    if (status === "resolved") {
      item.resolvedAt = new Date().toISOString().split("T")[0];
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("PUT /api/maintenance error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
