import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import ResignationLetter from "@/models/ResignationLetter";

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
    const resignation = await ResignationLetter.findById(id)
      .populate("employee_id", "employee_first_name employee_last_name email employee_profile")
      .lean();

    if (!resignation) {
      return NextResponse.json({ error: "Resignation not found" }, { status: 404 });
    }
    return NextResponse.json(resignation);
  } catch (err) {
    console.error("Resignation fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch resignation" }, { status: 500 });
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
    const resignation = await ResignationLetter.findByIdAndUpdate(id, body, {
      new: true,
    }).lean();
    if (!resignation) {
      return NextResponse.json({ error: "Resignation not found" }, { status: 404 });
    }
    return NextResponse.json(resignation);
  } catch (err) {
    console.error("Resignation update error:", err);
    return NextResponse.json({ error: "Failed to update resignation" }, { status: 500 });
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
    const resignation = await ResignationLetter.findByIdAndDelete(id);
    if (!resignation) {
      return NextResponse.json({ error: "Resignation not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Resignation deleted" });
  } catch (err) {
    console.error("Resignation delete error:", err);
    return NextResponse.json({ error: "Failed to delete resignation" }, { status: 500 });
  }
}
