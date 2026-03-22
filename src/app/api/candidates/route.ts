import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Candidate from "@/models/Candidate";

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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";
    const stage = searchParams.get("stage") || "";
    const recruitment = searchParams.get("recruitment") || searchParams.get("recruitment_id") || "";
    const startOnboard = searchParams.get("start_onboard") || "";
    const groupBy = searchParams.get("groupBy") || "";
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (stage) filter.stage_id = stage;
    if (recruitment) filter.recruitment_id = recruitment;
    if (startOnboard === "true") filter.start_onboard = true;

    if (groupBy) {
      const groupField = `$${groupBy}`;
      const grouped = await Candidate.aggregate([
        { $match: filter },
        {
          $group: {
            _id: groupField,
            candidates: { $push: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      return NextResponse.json({ data: grouped, grouped: true });
    }

    const [data, total] = await Promise.all([
      Candidate.find(filter)
        .populate("recruitment_id", "title")
        .populate("job_position_id", "job_position")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Candidate.countDocuments(filter),
    ]);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Candidates list error:", err);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
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
    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const candidate = await Candidate.create(body);
    return NextResponse.json(candidate, { status: 201 });
  } catch (err) {
    console.error("Candidate create error:", err);
    return NextResponse.json({ error: "Failed to create candidate" }, { status: 500 });
  }
}
