import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import LeaveType from "@/models/LeaveType";

connectDB();

export async function GET(req: NextRequest) {
  try {
    await getDataFromToken(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    let filter: Record<string, any> = {};
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const list = await LeaveType.find(filter).sort({ name: 1 }).lean();
    return NextResponse.json({ data: list });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch leave types" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await getDataFromToken(req);
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const type = await LeaveType.create(body);
    return NextResponse.json(type, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create leave type" },
      { status: 500 },
    );
  }
}
