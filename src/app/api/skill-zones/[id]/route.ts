import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import SkillZone from "@/models/SkillZone";

connectDB();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const skillZone = await SkillZone.findById(id).populate("candidates", "name email").lean();
    if (!skillZone) {
      return NextResponse.json({ error: "Skill zone not found" }, { status: 404 });
    }
    return NextResponse.json(skillZone);
  } catch (err) {
    console.error("Skill zone fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch skill zone" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const skillZone = await SkillZone.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!skillZone) {
      return NextResponse.json({ error: "Skill zone not found" }, { status: 404 });
    }
    return NextResponse.json(skillZone);
  } catch (err) {
    console.error("Skill zone update error:", err);
    return NextResponse.json({ error: "Failed to update skill zone" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const skillZone = await SkillZone.findByIdAndDelete(id);
    if (!skillZone) {
      return NextResponse.json({ error: "Skill zone not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Skill zone deleted" });
  } catch (err) {
    console.error("Skill zone delete error:", err);
    return NextResponse.json({ error: "Failed to delete skill zone" }, { status: 500 });
  }
}
