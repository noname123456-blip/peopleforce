import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import AssetRequest from "@/models/AssetRequest";
import { canManageAssets } from "@/lib/rbac";
import Employee from "@/models/Employee";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    const role = (payload.role || "EMPLOYEE") as any;

    let filter: Record<string, any> = {};

    if (!canManageAssets(role)) {
      const emp = await Employee.findOne({
        $or: [
          { employee_user_id: payload.id },
          { _id: payload.employeeId }
        ]
      }).lean();

      if (emp) {
        filter.employee_id = emp._id;
      } else {
        return NextResponse.json([]);
      }
    }

    const requests = await AssetRequest.find(filter)
      .populate("employee_id", "employee_first_name employee_last_name email employee_profile")
      .populate("asset_category_id", "asset_category_name")
      .populate("approved_by", "employee_first_name employee_last_name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(requests);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    const body = await req.json();

    if (!body.employee_id) {
      const emp = await Employee.findOne({
        $or: [
          { employee_user_id: payload.id },
          { _id: payload.employeeId }
        ]
      }).lean();

      if (!emp) {
        return NextResponse.json(
          { error: "Employee profile not found. Please ensure you have an active employee profile." },
          { status: 404 }
        );
      }
      body.employee_id = emp._id;
    }

    let request = await AssetRequest.create({
      ...body,
      status: "requested"
    });

    // Populate for frontend
    request = await AssetRequest.findById(request._id)
      .populate("employee_id", "employee_first_name employee_last_name email employee_profile")
      .populate("asset_category_id", "asset_category_name")
      .lean();

    return NextResponse.json(request, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to create request" },
      { status: 500 }
    );
  }
}
