import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Period from "@/models/Period";

connectDB();

export async function GET(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const periods = await Period.find().sort({ start_date: -1 }).lean();
    return NextResponse.json(periods);
  } catch { return NextResponse.json({ error: "Failed to fetch periods" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const period = await Period.create(body);
    return NextResponse.json(period, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create period" }, { status: 500 }); }
}
