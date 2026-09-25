import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Client } from "@/models/Client";
import { CredentialVault } from "@/models/CredentialVault";
import { Payment } from "@/models/Payment";
import { Representative } from "@/models/Representative";
import { MaintenanceLog } from "@/models/MaintenanceLog";
import { Broadcast } from "@/models/Broadcast";
import {
  initialClients,
  initialVaults,
  initialPayments,
  initialMaintenance,
  initialRepresentatives,
  initialBroadcasts,
} from "@/lib/store";

export async function GET() {
  const startTime = Date.now();
  try {
    const mongoose = await connectToDatabase();
    if (!mongoose) {
      return NextResponse.json({
        success: false,
        status: "disconnected",
        message: "MongoDB URI not configured or using in-memory mode",
        database: "in-memory fallback",
      });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({
        success: false,
        status: "disconnected",
        message: "Database object unavailable",
      });
    }

    const ping = await db.admin().ping();
    const duration = Date.now() - startTime;

    const [clientsCount, vaultsCount, paymentsCount, repsCount, maintCount, bcCount] =
      await Promise.all([
        Client.countDocuments(),
        CredentialVault.countDocuments(),
        Payment.countDocuments(),
        Representative.countDocuments(),
        MaintenanceLog.countDocuments(),
        Broadcast.countDocuments(),
      ]);

    return NextResponse.json({
      success: true,
      status: "connected",
      latencyMs: duration,
      database: db.databaseName,
      ping: ping.ok === 1 ? "OK" : "UNKNOWN",
      collections: {
        clients: clientsCount,
        credentialVaults: vaultsCount,
        payments: paymentsCount,
        representatives: repsCount,
        maintenanceLogs: maintCount,
        broadcasts: bcCount,
      },
    });
  } catch (error) {
    console.error("GET /api/system error:", error);
    return NextResponse.json(
      {
        success: false,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action || "seed";

    const mongoose = await connectToDatabase();
    if (!mongoose) {
      return NextResponse.json(
        { success: false, error: "Database not connected" },
        { status: 500 }
      );
    }

    if (action === "seed") {
      // Seed clients if none exist
      const existingClients = await Client.countDocuments();
      if (existingClients === 0) {
        // Map over initialClients and remove _id to let MongoDB generate ObjectIds, or keep string
        const createdClients = await Client.create(
          initialClients.map((c) => ({
            name: c.name,
            ownerName: c.ownerName,
            phone: c.phone,
            email: c.email,
            division: c.division,
            district: c.district,
            upazila: c.upazila,
            appType: c.appType,
            vercelUrl: c.vercelUrl,
            customDomain: c.customDomain || "",
            githubRepo: c.githubRepo || "",
            status: c.status,
            notes: c.notes || "",
            assignedRepCode: c.assignedRepCode || "",
          }))
        );

        // Seed Vaults matching client IDs
        for (let i = 0; i < createdClients.length; i++) {
          const client = createdClients[i];
          const seedVault = initialVaults[i] || initialVaults[0];
          await CredentialVault.create({
            clientId: client._id.toString(),
            clientName: client.name,
            dedicatedEmail: client.email,
            recoveryEmail: seedVault.recoveryEmail || "aulad.recovery@gmail.com",
            recoveryPhone: seedVault.recoveryPhone || "01700000000",
            encryptedData: seedVault.encryptedData,
            iv: seedVault.iv,
            authTag: seedVault.authTag,
          });
        }

        // Seed Payments matching client IDs
        for (let i = 0; i < createdClients.length; i++) {
          const client = createdClients[i];
          const seedPay = initialPayments[i] || initialPayments[0];
          await Payment.create({
            clientId: client._id.toString(),
            clientName: client.name,
            invoiceNumber: `INV-2026-${String(i + 1).padStart(3, "0")}`,
            totalAmount: seedPay.totalAmount,
            paidAmount: seedPay.paidAmount,
            dueAmount: seedPay.dueAmount,
            status: seedPay.status,
            installments: seedPay.installments,
            dueDate: seedPay.dueDate || "",
          });
        }

        // Seed Maintenance Logs
        for (let i = 0; i < Math.min(createdClients.length, initialMaintenance.length); i++) {
          const client = createdClients[i];
          const seedMaint = initialMaintenance[i];
          await MaintenanceLog.create({
            clientId: client._id.toString(),
            clientName: client.name,
            issueTitle: seedMaint.issueTitle,
            description: seedMaint.description,
            severity: seedMaint.severity,
            status: seedMaint.status,
            solutionNotes: seedMaint.solutionNotes || "",
            reportedAt: seedMaint.reportedAt,
            resolvedAt: seedMaint.resolvedAt || "",
          });
        }
      }

      // Seed Representatives if none exist
      const existingReps = await Representative.countDocuments();
      if (existingReps === 0) {
        await Representative.create(
          initialRepresentatives.map((r) => ({
            name: r.name,
            phone: r.phone,
            whatsapp: r.whatsapp,
            email: r.email,
            division: r.division,
            district: r.district,
            upazila: r.upazila,
            nidNumber: r.nidNumber,
            repCode: r.repCode,
            commissionType: r.commissionType,
            commissionValue: r.commissionValue,
            totalSalesCount: r.totalSalesCount,
            totalCommissionEarned: r.totalCommissionEarned,
            commissionPaid: r.commissionPaid,
            commissionDue: r.commissionDue,
            payoutMethod: r.payoutMethod,
            status: r.status,
          }))
        );
      }

      // Seed Broadcasts if none exist
      const existingBc = await Broadcast.countDocuments();
      if (existingBc === 0) {
        await Broadcast.create(
          initialBroadcasts.map((b) => ({
            title: b.title,
            message: b.message,
            targetAudience: b.targetAudience,
            channel: b.channel,
            sentAt: b.sentAt,
            recipientsCount: b.recipientsCount,
          }))
        );
      }

      return NextResponse.json({
        success: true,
        message: "Database seeded successfully with initial data!",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/system error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to execute system action",
      },
      { status: 500 }
    );
  }
}
