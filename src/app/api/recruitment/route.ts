import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Recruitment from "@/models/Recruitment";
import { canManageRecruitment } from "@/lib/rbac";

connectDB();

export async function GET(req: NextRequest) {
  try {
    const payload = await getDataFromToken(req);
    const role = (payload.role || "EMPLOYEE") as any;

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get("limit") || "10", 10)));
    const is_published = searchParams.get("is_published");
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (is_published === "true") filter.is_published = true;
    if (is_published === "false") filter.is_published = false;

    const recruitments = await Recruitment.find(filter)
      .populate("recruitment_managers", "employee_first_name employee_last_name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Recruitment.countDocuments(filter);

    return NextResponse.json({
      data: recruitments,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch recruitment data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getDataFromToken(req);
    // Add RBAC check if needed: if (!canManageRecruitment(payload.role)) ...

    const body = await req.json();
    const recruitment = await Recruitment.create(body);

    return NextResponse.json(recruitment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create recruitment" }, { status: 500 });
  }
}
