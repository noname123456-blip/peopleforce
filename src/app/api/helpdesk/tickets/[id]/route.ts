import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Ticket from "@/models/Ticket";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const ticket = await Ticket.findById(id)
      .populate("employee_id", "employee_first_name employee_last_name email employee_profile")
      .populate("ticket_type").populate("assigning_department", "department").lean();
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    return NextResponse.json(ticket);
  } catch { return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const body = await req.json();
    const ticket = await Ticket.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    return NextResponse.json(ticket);
  } catch { return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const ticket = await Ticket.findByIdAndDelete(id);
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    return NextResponse.json({ message: "Ticket deleted" });
  } catch { return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 }); }
}
