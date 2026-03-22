import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import PMSObjective from "@/models/PMSObjective";

connectDB();

export async function GET(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const objectives = await PMSObjective.find()
      .populate("managers", "employee_first_name employee_last_name email employee_profile")
      .populate("assignees", "employee_first_name employee_last_name email employee_profile")
      .populate("key_result_ids")
      .sort({ createdAt: -1 }).lean();
    return NextResponse.json(objectives);
  } catch { return NextResponse.json({ error: "Failed to fetch objectives" }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const body = await req.json();
    const objective = await PMSObjective.create(body);
    return NextResponse.json(objective, { status: 201 });
  } catch (err: any) { return NextResponse.json({ error: err.message || "Failed to create objective" }, { status: 500 }); }
}
