import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import { canManageLeave } from "@/lib/rbac";
import LeaveRequest from "@/models/LeaveRequest";
import Employee from "@/models/Employee";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    const role = (payload.role || "EMPLOYEE") as
      | "ADMIN"
      | "HR_MANAGER"
      | "MANAGER"
      | "EMPLOYEE";

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(10, parseInt(searchParams.get("limit") || "20", 10)),
    );
    const skip = (page - 1) * limit;

    let filter: Record<string, unknown> = {};
    if (!canManageLeave(role)) {
      const emp = await Employee.findOne({
        employee_user_id: payload.id,
      }).lean();
      if (emp) filter.employee_id = emp._id;
      else
        return NextResponse.json({
          data: [],
          pagination: { total: 0, page, limit, pages: 0 },
        });
    }

    const [data, total] = await Promise.all([
      LeaveRequest.find(filter)
        .populate("employee_id", "employee_first_name employee_last_name")
        .populate("leave_type_id", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LeaveRequest.countDocuments(filter),
    ]);

    return NextResponse.json({
      data,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (e) {
    console.error("Leave requests GET error:", e);
    return NextResponse.json(
      { error: "Failed to fetch leave requests" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    const body = await req.json();

    // Resolve employee_id if not provided
    if (!body.employee_id) {
      // Try both id and employeeId from token
      let emp = await Employee.findOne({
        $or: [
          { employee_user_id: payload.id },
          { _id: payload.employeeId }
        ]
      }).lean();

      if (!emp) {
        return NextResponse.json(
          { error: "Employee profile not found. Please ensure you have an active employee profile." },
          { status: 404 },
        );
      }
      body.employee_id = emp._id;
    }

    // Ensure description is not empty (backend validation)
    if (!body.description || body.description.trim() === "") {
        return NextResponse.json(
            { error: "Description/Reason is required" },
            { status: 400 }
        );
    }

    // Fallback calculation for requested_days if missing
    if (!body.requested_days) {
        const start = new Date(body.start_date);
        const end = body.end_date ? new Date(body.end_date) : start;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        body.requested_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        // Basic half-day adjustment
        if (body.start_date_breakdown && body.start_date_breakdown !== "full_day") body.requested_days -= 0.5;
        if (body.end_date_breakdown && body.end_date_breakdown !== "full_day") body.requested_days -= 0.5;
        body.requested_days = Math.max(0.5, body.requested_days);
    }

    const leaveRequest = await LeaveRequest.create({
      ...body,
      requested_date: new Date(),
      status: "requested",
      created_by: body.employee_id, // Map created_by
    });

    return NextResponse.json(leaveRequest, { status: 201 });
  } catch (err: any) {
    console.error("Leave request POST error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create leave request" },
      { status: 500 },
    );
  }
}
