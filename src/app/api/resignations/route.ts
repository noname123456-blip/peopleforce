import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import ResignationLetter from "@/models/ResignationLetter";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const data = await ResignationLetter.find(filter)
      .populate("employee_id", "employee_first_name employee_last_name email employee_profile")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Resignations list error:", err);
    return NextResponse.json({ error: "Failed to fetch resignations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.employee_id || !body.planned_to_leave_on) {
      return NextResponse.json({ error: "Employee and planned leave date are required" }, { status: 400 });
    }

    const resignation = await ResignationLetter.create(body);
    return NextResponse.json(resignation, { status: 201 });
  } catch (err) {
    console.error("Resignation create error:", err);
    return NextResponse.json({ error: "Failed to create resignation" }, { status: 500 });
  }
}
