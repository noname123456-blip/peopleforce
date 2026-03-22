import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Policy from "@/models/Policy";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest, { params }: any) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const policy = await Policy.findById(id)
      .populate("last_updated_by", "employee_first_name employee_last_name")
      .lean();

    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }
    return NextResponse.json(policy);
  } catch (err) {
    console.error("Policy fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch policy" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: any) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const policy = await Policy.findByIdAndUpdate(
      id,
      { ...body, $inc: { version: 1 } },
      { new: true }
    ).lean();
    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }
    return NextResponse.json(policy);
  } catch (err) {
    console.error("Policy update error:", err);
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const policy = await Policy.findByIdAndDelete(id);
    if (!policy) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Policy deleted" });
  } catch (err) {
    console.error("Policy delete error:", err);
    return NextResponse.json({ error: "Failed to delete policy" }, { status: 500 });
  }
}
