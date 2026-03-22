import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Deduction from "@/models/Deduction";

connectDB();

export async function GET(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const deductions = await Deduction.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(deductions);
  } catch { return NextResponse.json({ error: "Failed to fetch deductions" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const deduction = await Deduction.create(body);
    return NextResponse.json(deduction, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create deduction" }, { status: 500 }); }
}
