import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import PMSObjective from "@/models/PMSObjective";

connectDB();

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const objective = await PMSObjective.findById(id).populate("managers").populate("assignees").populate("key_result_ids").lean();
    if (!objective) return NextResponse.json({ error: "Objective not found" }, { status: 404 });
    return NextResponse.json(objective);
  } catch { return NextResponse.json({ error: "Failed to fetch objective" }, { status: 500 }); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const body = await req.json();
    const objective = await PMSObjective.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!objective) return NextResponse.json({ error: "Objective not found" }, { status: 404 });
    return NextResponse.json(objective);
  } catch { return NextResponse.json({ error: "Failed to update objective" }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await getDataFromToken(req); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  try {
    const { id } = await params;
    const objective = await PMSObjective.findByIdAndDelete(id);
    if (!objective) return NextResponse.json({ error: "Objective not found" }, { status: 404 });
    return NextResponse.json({ message: "Objective deleted" });
  } catch { return NextResponse.json({ error: "Failed to delete objective" }, { status: 500 }); }
}
