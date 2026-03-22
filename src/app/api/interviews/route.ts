import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import InterviewSchedule from "@/models/InterviewSchedule";

connectDB();

export async function GET(req: NextRequest) {
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const list = await InterviewSchedule.find({})
      .populate("candidate_id", "name email")
      .populate("employee_id", "employee_first_name employee_last_name")
      .sort({ interview_date: -1 })
      .lean();
    return NextResponse.json({ data: list });
  } catch (err: any) {
    console.error("Interviews fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const interview = await InterviewSchedule.create(body);
    return NextResponse.json(interview, { status: 201 });
  } catch (err: any) {
    console.error("Interview create error:", err);
    return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 });
  }
}
