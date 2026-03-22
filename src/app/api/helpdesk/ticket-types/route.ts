import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import TicketType from "@/models/TicketType";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const types = await TicketType.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(types);
  } catch { return NextResponse.json({ error: "Failed to fetch ticket types" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const type = await TicketType.create(body);
    return NextResponse.json(type, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create ticket type" }, { status: 500 }); }
}
