import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Policy from "@/models/Policy";

connectDB();

export async function GET(req: NextRequest) {
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (status) filter.status = status;

    const data = await Policy.find(filter)
      .populate("last_updated_by", "employee_first_name employee_last_name")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Policies list error:", err);
    return NextResponse.json({ error: "Failed to fetch policies" }, { status: 500 });
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
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const existing = await Policy.findOne({ title: body.title });
    if (existing) {
      return NextResponse.json({ error: "A policy with this title already exists" }, { status: 400 });
    }

    const policy = await Policy.create(body);
    return NextResponse.json(policy, { status: 201 });
  } catch (err) {
    console.error("Policy create error:", err);
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 });
  }
}
