import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import OnboardingStage from "@/models/OnboardingStage";
import { canManageOnboarding } from "@/lib/rbac";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    const role = (payload.role || "EMPLOYEE") as any;

    if (!canManageOnboarding(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stages = await OnboardingStage.find({})
      .populate("employee_id", "employee_first_name employee_last_name")
      .sort({ sequence: 1 })
      .lean();

    return NextResponse.json({ data: stages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch onboarding stages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    if (!canManageOnboarding(payload.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const stage = await OnboardingStage.create(body);
    return NextResponse.json(stage, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create onboarding stage" }, { status: 500 });
  }
}
