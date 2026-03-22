import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import JobPosition from "@/models/JobPosition";

connectDB();

export async function GET(req: NextRequest) {
  try {
    const list = await JobPosition.find({}).populate("department_id").sort({ job_position: 1 }).lean();
    return NextResponse.json({ data: list });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch job positions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const pos = await JobPosition.create(body);
    return NextResponse.json(pos, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
