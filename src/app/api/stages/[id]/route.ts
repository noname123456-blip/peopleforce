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
    const { id } = await params;
    const stage = await Stage.findById(id)
      .populate("stage_managers", "employee_first_name employee_last_name")
      .lean();

    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    return NextResponse.json(stage);
  } catch (err) {
    console.error("Stage fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch stage" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    
    const stage = await Stage.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    return NextResponse.json(stage);
  } catch (err) {
    console.error("Stage update error:", err);
    return NextResponse.json({ error: "Failed to update stage" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const stage = await Stage.findByIdAndDelete(id);

    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Stage deleted successfully" });
  } catch (err) {
    console.error("Stage delete error:", err);
    return NextResponse.json({ error: "Failed to delete stage" }, { status: 500 });
  }
}
