import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import OrgChart from "@/models/OrgChart";
import { canManageEmployees } from "@/lib/rbac";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    const orgChart = await OrgChart.find()
      .populate("employee_id", "employee_first_name employee_last_name employee_profile")
      .lean();

    return NextResponse.json({ data: orgChart });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch org chart" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    const role = (payload.role || "EMPLOYEE") as any;

    if (!canManageEmployees(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    if (body.parent_id === "" || body.parent_id === undefined) {
      body.parent_id = null;
    }
    const node = await OrgChart.create(body);
    const populated = await OrgChart.findById(node._id).populate("employee_id", "employee_first_name employee_last_name employee_profile").lean();

    return NextResponse.json(populated, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create org chart node" }, { status: 500 });
  }
}
