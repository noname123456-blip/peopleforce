import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Payslip from "@/models/Payslip";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const payslip = await Payslip.findById(id).populate("employee_id", "employee_first_name employee_last_name email").lean();
    if (!payslip) return NextResponse.json({ error: "Payslip not found" }, { status: 404 });
    return NextResponse.json(payslip);
  } catch { return NextResponse.json({ error: "Failed to fetch payslip" }, { status: 500 }); }
}

export async function PUT(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const body = await req.json();
    const payslip = await Payslip.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!payslip) return NextResponse.json({ error: "Payslip not found" }, { status: 404 });
    return NextResponse.json(payslip);
  } catch { return NextResponse.json({ error: "Failed to update payslip" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const payslip = await Payslip.findByIdAndDelete(id);
    if (!payslip) return NextResponse.json({ error: "Payslip not found" }, { status: 404 });
    return NextResponse.json({ message: "Payslip deleted" });
  } catch { return NextResponse.json({ error: "Failed to delete payslip" }, { status: 500 }); }
}
