import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Client } from "@/models/Client";
import { Payment } from "@/models/Payment";
import { Representative } from "@/models/Representative";
import { MaintenanceLog } from "@/models/MaintenanceLog";
import { store } from "@/lib/store";
import { BANGLADESH_DISTRICTS } from "@/lib/bangladesh-data";

export async function GET() {
  try {
    const mongoose = await connectToDatabase();

    if (mongoose) {
      const totalClients = await Client.countDocuments();
      const activeProjects = await Client.countDocuments({ status: "active" });
      const inProgressProjects = await Client.countDocuments({ status: "in_progress" });

      const payments = await Payment.find();
      const totalRevenue = payments.reduce((acc, p) => acc + (p.paidAmount || 0), 0);
      const totalDue = payments.reduce((acc, p) => acc + (p.dueAmount || 0), 0);

      const totalReps = await Representative.countDocuments({ status: "active" });
      const openTickets = await MaintenanceLog.countDocuments({ status: { $ne: "resolved" } });

      // Unique covered districts
      const repDistricts = await Representative.distinct("district");
      const coverageCount = repDistricts.length;

      return NextResponse.json({
        success: true,
        data: {
          totalClients,
          activeProjects,
          inProgressProjects,
          totalRevenue,
          totalDue,
          totalReps,
          openTickets,
          coverageCount,
          totalDistricts: BANGLADESH_DISTRICTS.length,
        },
      });
    }

    // In-memory fallback
    const totalClients = store.clients.length;
    const activeProjects = store.clients.filter((c) => c.status === "active").length;
    const inProgressProjects = store.clients.filter((c) => c.status === "in_progress").length;

    const totalRevenue = store.payments.reduce((acc, p) => acc + (p.paidAmount || 0), 0);
    const totalDue = store.payments.reduce((acc, p) => acc + (p.dueAmount || 0), 0);

    const totalReps = store.representatives.filter((r) => r.status === "active").length;
    const openTickets = store.maintenance.filter((m) => m.status !== "resolved").length;

    const coveredDistricts = new Set(store.representatives.map((r) => r.district));

    return NextResponse.json({
      success: true,
      data: {
        totalClients,
        activeProjects,
        inProgressProjects,
        totalRevenue,
        totalDue,
        totalReps,
        openTickets,
        coverageCount: coveredDistricts.size,
        totalDistricts: BANGLADESH_DISTRICTS.length,
      },
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
