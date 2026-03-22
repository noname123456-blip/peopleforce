import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Stage from "@/models/Stage";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const recruitment = searchParams.get("recruitment") || searchParams.get("recruitment_id") || "";

    const filter: Record<string, unknown> = {};
    if (recruitment) filter.recruitment_id = recruitment;

    const data = await Stage.find(filter)
      .populate("stage_managers", "employee_first_name employee_last_name")
      .sort({ sequence: 1 })
      .lean();

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Stages list error:", err);
    return NextResponse.json({ error: "Failed to fetch stages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.recruitment_id || !body.stage) {
      return NextResponse.json({ error: "Recruitment and stage name are required" }, { status: 400 });
    }

    const stage = await Stage.create(body);
    return NextResponse.json(stage, { status: 201 });
  } catch (err) {
    console.error("Stage create error:", err);
    return NextResponse.json({ error: "Failed to create stage" }, { status: 500 });
  }
}
export async function PATCH(req: NextRequest) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: "Expected an array of updates" }, { status: 400 });
    }

    const updates = body.map((item: any) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { sequence: item.sequence } },
      },
    }));

    await Stage.bulkWrite(updates);

    return NextResponse.json({ message: "Stages updated successfully" });
  } catch (err) {
    console.error("Stages bulk update error:", err);
    return NextResponse.json({ error: "Failed to update stages" }, { status: 500 });
  }
}
