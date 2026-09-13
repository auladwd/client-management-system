import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Broadcast } from "@/models/Broadcast";
import { Representative } from "@/models/Representative";
import { store } from "@/lib/store";

export async function GET() {
  try {
    const mongoose = await connectToDatabase();

    if (mongoose) {
      const logs = await Broadcast.find().sort({ createdAt: -1 });
      return NextResponse.json({ success: true, data: logs });
    }

    return NextResponse.json({ success: true, data: store.broadcasts });
  } catch (error) {
    console.error("GET /api/broadcast error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, message, targetAudience, targetValue, channel } = body;

    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: "Title and message are required" },
        { status: 400 }
      );
    }

    const mongoose = await connectToDatabase();
    let targetedReps: { name: string; phone: string; whatsapp: string; district: string }[] = [];

    if (mongoose) {
      const query: Record<string, unknown> = { status: "active" };
      if (targetAudience === "division" && targetValue) {
        query.division = targetValue;
      } else if (targetAudience === "district" && targetValue) {
        query.district = targetValue;
      }
      const found = await Representative.find(query);
      targetedReps = found.map((r) => ({
        name: r.name,
        phone: r.phone,
        whatsapp: r.whatsapp,
        district: r.district,
      }));
    } else {
      let list = store.representatives.filter((r) => r.status === "active");
      if (targetAudience === "division" && targetValue) {
        list = list.filter((r) => r.division.toLowerCase() === targetValue.toLowerCase());
      } else if (targetAudience === "district" && targetValue) {
        list = list.filter((r) => r.district.toLowerCase() === targetValue.toLowerCase());
      }
      targetedReps = list.map((r) => ({
        name: r.name,
        phone: r.phone,
        whatsapp: r.whatsapp,
        district: r.district,
      }));
    }

    // Generate personalized WhatsApp direct dispatch links
    const broadcastLinks = targetedReps.map((rep) => {
      const personalizedMsg = `আসসালামু আলাইকুম ${rep.name} ভাই,\n\n${title}\n\n${message}\n\nধন্যবাদান্তে,\nআওলাদ হোসেন\nAulad IT Solution`;
      const encodedMsg = encodeURIComponent(personalizedMsg);
      const cleanWa = rep.whatsapp.replace(/[^0-9]/g, "");
      return {
        name: rep.name,
        district: rep.district,
        phone: rep.phone,
        whatsapp: cleanWa,
        directUrl: `https://wa.me/${cleanWa}?text=${encodedMsg}`,
      };
    });

    const nowStr = new Date().toISOString().replace("T", " ").slice(0, 16);

    if (mongoose) {
      const record = await Broadcast.create({
        title,
        message,
        targetAudience: targetAudience || "all",
        targetValue: targetValue || "",
        channel: channel || "whatsapp",
        sentAt: nowStr,
        recipientsCount: targetedReps.length,
      });

      return NextResponse.json({
        success: true,
        data: record,
        recipients: broadcastLinks,
      });
    }

    const newBc = {
      _id: `bc-${Date.now()}`,
      title,
      message,
      targetAudience: targetAudience || ("all" as const),
      targetValue: targetValue || "",
      channel: channel || ("whatsapp" as const),
      sentAt: nowStr,
      recipientsCount: targetedReps.length,
    };

    store.broadcasts.unshift(newBc);

    return NextResponse.json({
      success: true,
      data: newBc,
      recipients: broadcastLinks,
    });
  } catch (error) {
    console.error("POST /api/broadcast error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
