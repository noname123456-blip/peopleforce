import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import Department from "@/models/Department";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    const list = await Department.find({}).sort({ department: 1 }).lean();
    return NextResponse.json({ data: list });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const body = await req.json();
    const dept = await Department.create(body);
    return NextResponse.json(dept, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
