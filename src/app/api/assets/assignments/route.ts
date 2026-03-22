import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import AssetAssignment from "@/models/AssetAssignment";

connectDB();

export async function GET(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const assignments = await AssetAssignment.find()
      .populate("asset_id", "asset_name asset_tracking_id")
      .populate("assigned_to_employee_id", "employee_first_name employee_last_name email employee_profile")
      .populate("assigned_by_employee_id", "employee_first_name employee_last_name")
      .sort({ createdAt: -1 }).lean();
    return NextResponse.json(assignments);
  } catch { return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const assignment = await AssetAssignment.create(body);
    return NextResponse.json(assignment, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create assignment" }, { status: 500 }); }
}
