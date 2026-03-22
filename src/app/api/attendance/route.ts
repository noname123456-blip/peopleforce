import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Attendance from "@/models/Attendance";
import Employee from "@/models/Employee";
import { canManageAttendance } from "@/lib/rbac";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    const role = (payload.role || "EMPLOYEE") as any;

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "31", 10)));
    const skip = (page - 1) * limit;
    const employeeId = searchParams.get("employee_id");
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");

    let filter: Record<string, any> = {};

    if (!canManageAttendance(role)) {
      const emp = await Employee.findOne({ employee_user_id: payload.id }).lean();
      if (emp) filter.employee_id = emp._id;
      else return NextResponse.json({ data: [], pagination: { total: 0, page, limit, pages: 0 } });
    } else if (employeeId) {
      filter.employee_id = employeeId;
    }

    if (startDate || endDate) {
      filter.attendance_date = {};
      if (startDate) filter.attendance_date.$gte = new Date(startDate);
      if (endDate) filter.attendance_date.$lte = new Date(endDate);
    }

    const list = await Attendance.find(filter)
      .populate("employee_id", "employee_first_name employee_last_name")
      .sort({ attendance_date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Attendance.countDocuments(filter);

    return NextResponse.json({
      data: list,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    const body = await req.json();
    const role = (payload.role || "EMPLOYEE") as any;

    // Resolve employee_id if not provided
    if (!canManageAttendance(role) || !body.employee_id) {
      const emp = await Employee.findOne({ employee_user_id: payload.id }).lean();
      if (!emp) {
        return NextResponse.json({ error: "Employee profile not found" }, { status: 404 });
      }
      body.employee_id = emp._id;
    }

    // Check if attendance already exists for this employee on this date
    const existing = await Attendance.findOne({
      employee_id: body.employee_id,
      attendance_date: body.attendance_date
    });

    if (existing) {
      return NextResponse.json({ error: "Attendance already exists for this date" }, { status: 400 });
    }

    const attendance = await Attendance.create(body);
    return NextResponse.json(attendance, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log attendance" }, { status: 500 });
  }
}
