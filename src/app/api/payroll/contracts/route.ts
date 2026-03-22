import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Contract from "@/models/Contract";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const contracts = await Contract.find()
      .populate("employee_id", "employee_first_name employee_last_name email employee_profile")
      .populate("department_id", "department")
      .populate("job_position_id", "job_position")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(contracts);
  } catch (err) {
    console.error("Contracts fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 });
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
    const contract = await Contract.create(body);
    return NextResponse.json(contract, { status: 201 });
  } catch (err: any) {
    console.error("Contract create error:", err);
    return NextResponse.json({ error: err.message || "Failed to create contract" }, { status: 500 });
  }
}
