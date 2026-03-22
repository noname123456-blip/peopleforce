import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import OnboardingStage from "@/models/OnboardingStage";
import { canManageOnboarding } from "@/lib/rbac";

connectDB();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getDataFromToken(req);
    if (!canManageOnboarding(payload.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const stage = await OnboardingStage.findById(id)
      .populate("employee_id", "employee_first_name employee_last_name email")
      .lean();

    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    return NextResponse.json(stage);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch stage" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getDataFromToken(req);
    if (!canManageOnboarding(payload.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const stage = await OnboardingStage.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    return NextResponse.json(stage);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update stage" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const payload = await getDataFromToken(req);
    if (!canManageOnboarding(payload.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const stage = await OnboardingStage.findByIdAndDelete(id);
    if (!stage) {
      return NextResponse.json({ error: "Stage not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Stage deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete stage" },
      { status: 500 },
    );
  }
}
