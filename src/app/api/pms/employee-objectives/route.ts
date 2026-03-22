import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import EmployeeObjective from "@/models/EmployeeObjective";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const eos = await EmployeeObjective.find()
      .populate("employee_id", "employee_first_name employee_last_name email employee_profile")
      .populate("objective_id", "title description")
      .sort({ createdAt: -1 }).lean();
    return NextResponse.json(eos);
  } catch { return NextResponse.json({ error: "Failed to fetch employee objectives" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const eo = await EmployeeObjective.create(body);
    return NextResponse.json(eo, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create employee objective" }, { status: 500 }); }
}
