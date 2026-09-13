import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Representative } from "@/models/Representative";
import { store } from "@/lib/store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const division = searchParams.get("division");
    const district = searchParams.get("district");
    const status = searchParams.get("status");

    const mongoose = await connectToDatabase();

    if (mongoose) {
      const query: Record<string, unknown> = {};
      if (division) query.division = division;
      if (district) query.district = district;
      if (status) query.status = status;
      const reps = await Representative.find(query).sort({ totalSalesCount: -1 });
      return NextResponse.json({ success: true, data: reps });
    }

    let filtered = [...store.representatives];
    if (division) {
      filtered = filtered.filter((r) => r.division.toLowerCase() === division.toLowerCase());
    }
    if (district) {
      filtered = filtered.filter((r) => r.district.toLowerCase() === district.toLowerCase());
    }
    if (status) {
      filtered = filtered.filter((r) => r.status === status);
    }

    return NextResponse.json({ success: true, data: filtered });
  } catch (error) {
    console.error("GET /api/representatives error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      whatsapp,
      email,
      division,
      district,
      upazila,
      nidNumber,
      nidPhotoUrl,
      repCode,
      commissionType,
      commissionValue,
      payoutMethod,
    } = body;

    if (!name || !phone || !division || !district || !upazila) {
      return NextResponse.json(
        { success: false, error: "Required fields missing" },
        { status: 400 }
      );
    }

    // Format whatsapp: remove spaces, ensure country code 88 if not present
    let cleanWa = (whatsapp || phone).replace(/[^0-9]/g, "");
    if (cleanWa.startsWith("0")) {
      cleanWa = "88" + cleanWa;
    }

    const code =
      repCode ||
      `REP-${district.slice(0, 3).toUpperCase()}-${String(store.representatives.length + 1).padStart(2, "0")}`;

    const mongoose = await connectToDatabase();

    if (mongoose) {
      const rep = await Representative.create({
        name,
        phone,
        whatsapp: cleanWa,
        email: email || "",
        division,
        district,
        upazila,
        nidNumber: nidNumber || "",
        nidPhotoUrl: nidPhotoUrl || "",
        repCode: code,
        commissionType: commissionType || "fixed",
        commissionValue: Number(commissionValue) || 1000,
        payoutMethod: payoutMethod || "",
        status: "active",
      });
      return NextResponse.json({ success: true, data: rep });
    }

    const newRep = {
      _id: `rep-${Date.now()}`,
      name,
      phone,
      whatsapp: cleanWa,
      email: email || "",
      division,
      district,
      upazila,
      nidNumber: nidNumber || "",
      nidPhotoUrl: nidPhotoUrl || "",
      repCode: code,
      commissionType: commissionType || ("fixed" as const),
      commissionValue: Number(commissionValue) || 1000,
      totalSalesCount: 0,
      totalCommissionEarned: 0,
      commissionPaid: 0,
      commissionDue: 0,
      payoutMethod: payoutMethod || "",
      status: "active" as const,
    };

    store.representatives.push(newRep);
    return NextResponse.json({ success: true, data: newRep });
  } catch (error) {
    console.error("POST /api/representatives error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
