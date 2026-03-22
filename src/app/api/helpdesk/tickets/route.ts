import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Ticket from "@/models/Ticket";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const tickets = await Ticket.find()
      .populate("employee_id", "employee_first_name employee_last_name email employee_profile")
      .populate("ticket_type", "title type prefix")
      .populate("assigning_department", "department")
      .sort({ createdAt: -1 }).lean();
    return NextResponse.json(tickets);
  } catch { return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const ticket = await Ticket.create(body);
    return NextResponse.json(ticket, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create ticket" }, { status: 500 }); }
}
