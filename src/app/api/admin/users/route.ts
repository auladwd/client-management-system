import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AllowedUser } from "@/models/AllowedUser";
import { SUPER_ADMIN_EMAIL } from "@/app/api/auth/verify/route";

// GET all allowed users
export async function GET() {
  try {
    await connectToDatabase();
    const users = await AllowedUser.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      superAdmin: SUPER_ADMIN_EMAIL,
      users,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST: Add new allowed email
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email ? String(body.email).trim().toLowerCase() : "";
    const name = body.name ? String(body.name).trim() : "";
    const role = body.role || "admin";
    const notes = body.notes ? String(body.notes).trim() : "";
    const addedBy = body.addedBy ? String(body.addedBy).trim().toLowerCase() : SUPER_ADMIN_EMAIL;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "সঠিক ইমেইল এড্রেস প্রদান করুন" },
        { status: 400 }
      );
    }

    if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: `${SUPER_ADMIN_EMAIL} প্রধান সুপার এডমিন হিসেবে ডিফল্টভাবেই অনুমোদিত!` },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await AllowedUser.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "এই ইমেইলটি ইতোমধ্যে তালিকায় বিদ্যমান রয়েছে।" },
        { status: 400 }
      );
    }

    const newUser = await AllowedUser.create({
      email,
      name,
      role,
      status: "active",
      addedBy,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: `${email} সফলভাবে অনুমোদিত তালিকায় যুক্ত হয়েছে!`,
      user: newUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add user" },
      { status: 500 }
    );
  }
}

// PATCH: Toggle status or update role
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, role, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ইউজার আইডি আবশ্যক" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updated = await AllowedUser.findByIdAndUpdate(
      id,
      {
        ...(status && { status }),
        ...(role && { role }),
        ...(notes !== undefined && { notes }),
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "তথ্য সফলভাবে আপডেট হয়েছে",
      user: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update" },
      { status: 500 }
    );
  }
}

// DELETE: Remove allowed email
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ইউজার আইডি প্রদান করুন" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await AllowedUser.findById(id);
    if (user && user.email === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: "সুপার এডমিন মুছে ফেলা সম্ভব নয়" },
        { status: 400 }
      );
    }

    await AllowedUser.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "অনুমতি তালিকা থেকে ইউজার অপসারণ করা হয়েছে",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete" },
      { status: 500 }
    );
  }
}
