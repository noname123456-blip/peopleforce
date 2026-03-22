import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import PMSFeedback from "@/models/PMSFeedback";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const feedback = await PMSFeedback.find()
      .populate("manager_id", "employee_first_name employee_last_name email")
      .populate("employee_id", "employee_first_name employee_last_name email employee_profile")
      .populate("period_id", "period_name")
      .sort({ createdAt: -1 }).lean();
    return NextResponse.json(feedback);
  } catch { return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const f = await PMSFeedback.create(body);
    return NextResponse.json(f, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create feedback" }, { status: 500 }); }
}
