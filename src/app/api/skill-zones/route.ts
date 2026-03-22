import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import SkillZone from "@/models/SkillZone";

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
    const search = searchParams.get("search") || "";

    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const data = await SkillZone.find(filter)
      .populate("candidates", "name email") // Adjust fields as necessary
      .sort({ createdAt: -1 })
      .lean();
      
    return NextResponse.json({ data });
  } catch (err) {
    console.error("Skill Zones list error:", err);
    return NextResponse.json({ error: "Failed to fetch skill zones" }, { status: 500 });
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
    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const skillZone = await SkillZone.create(body);
    return NextResponse.json(skillZone, { status: 201 });
  } catch (err) {
    console.error("Skill zone create error:", err);
    return NextResponse.json({ error: "Failed to create skill zone" }, { status: 500 });
  }
}
