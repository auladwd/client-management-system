import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { AllowedUser } from "@/models/AllowedUser";

export const SUPER_ADMIN_EMAIL = "auladinfo@gmail.com";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawEmail = body.email;

    if (!rawEmail || typeof rawEmail !== "string") {
      return NextResponse.json(
        { allowed: false, error: "ইমেইল প্রদান করা আবশ্যক" },
        { status: 400 }
      );
    }

    const email = rawEmail.trim().toLowerCase();

    // 1. Root Super Admin check: always allowed
    if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json({
        allowed: true,
        email: SUPER_ADMIN_EMAIL,
        name: "Md. Aulad Hossen",
        role: "superadmin",
        isSuperAdmin: true,
      });
    }

    // 2. Check Whitelist in Database
    await connectToDatabase();
    const allowed = await AllowedUser.findOne({
      email,
      status: "active",
    }).lean() as { email: string; name?: string; role: string } | null;

    if (allowed) {
      return NextResponse.json({
        allowed: true,
        email: allowed.email,
        name: allowed.name || "এডমিন ইউজার",
        role: allowed.role || "admin",
        isSuperAdmin: false,
      });
    }

    // 3. Not allowed
    return NextResponse.json(
      {
        allowed: false,
        error: `দুঃখিত (${email}), আপনার এই পোর্টালে প্রবেশের অনুমতি নেই। শুধুমাত্র সুপার এডমিন (${SUPER_ADMIN_EMAIL}) এর অনুমোদিত ইমেইল প্রবেশ করতে পারবে।`,
      },
      { status: 403 }
    );
  } catch (error: any) {
    console.error("Auth verify error:", error);
    return NextResponse.json(
      { allowed: false, error: "যাচাইকরণে অভ্যন্তরীণ ত্রুটি হয়েছে" },
      { status: 500 }
    );
  }
}
