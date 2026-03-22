import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import OffboardingStage from "@/models/OffboardingStage";
import { canManageOffboarding } from "@/lib/rbac";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    const role = (payload.role || "EMPLOYEE") as any;

    if (!canManageOffboarding(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const stages = await OffboardingStage.find({})
      .sort({ sequence: 1 })
      .lean();

    return NextResponse.json({ data: stages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch offboarding stages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    if (!canManageOffboarding(payload.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const stage = await OffboardingStage.create(body);
    return NextResponse.json(stage, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create offboarding stage" }, { status: 500 });
  }
}
