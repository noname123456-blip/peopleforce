import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Payslip from "@/models/Payslip";

connectDB();

export async function GET(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const payslips = await Payslip.find()
      .populate("employee_id", "employee_first_name employee_last_name email employee_profile")
      .populate("contract_id", "contract_name")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(payslips);
  } catch (err) { return NextResponse.json({ error: "Failed to fetch payslips" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const payslip = await Payslip.create(body);
    return NextResponse.json(payslip, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create payslip" }, { status: 500 }); }
}
