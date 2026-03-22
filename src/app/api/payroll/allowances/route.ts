import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Allowance from "@/models/Allowance";

connectDB();

export async function GET(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const allowances = await Allowance.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(allowances);
  } catch { return NextResponse.json({ error: "Failed to fetch allowances" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const allowance = await Allowance.create(body);
    return NextResponse.json(allowance, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create allowance" }, { status: 500 }); }
}
