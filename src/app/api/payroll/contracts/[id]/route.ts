import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Contract from "@/models/Contract";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest, { params }: any) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const contract = await Contract.findById(id).populate("employee_id", "employee_first_name employee_last_name email").lean();
    if (!contract) return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    return NextResponse.json(contract);
  } catch (err) { return NextResponse.json({ error: "Failed to fetch contract" }, { status: 500 }); }
}

export async function PUT(req: NextRequest, { params }: any) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const body = await req.json();
    const contract = await Contract.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!contract) return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    return NextResponse.json(contract);
  } catch (err) { return NextResponse.json({ error: "Failed to update contract" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: any) {
    await connectDB();
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const contract = await Contract.findByIdAndDelete(id);
    if (!contract) return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    return NextResponse.json({ message: "Contract deleted" });
  } catch (err) { return NextResponse.json({ error: "Failed to delete contract" }, { status: 500 }); }
}
