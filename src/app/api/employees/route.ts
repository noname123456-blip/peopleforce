import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import { canManageEmployees } from "@/lib/rbac";
import Employee from "@/models/Employee";
import EmployeeWorkInformation from "@/models/EmployeeWorkInformation";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  let payload: { role?: string };
  try {
    payload = await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (payload.role || "EMPLOYEE") as "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
  if (!canManageEmployees(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(10, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search") || "";
    const inactive = searchParams.get("inactive") || "";
    const department_id = searchParams.get("department_id") || "";
    const job_position_id = searchParams.get("job_position_id") || "";
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { is_active: inactive === "1" ? false : true };
    if (search) {
      filter.$or = [
        { employee_first_name: { $regex: search, $options: "i" } },
        { employee_last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { badge_id: { $regex: search, $options: "i" } },
      ];
    }

    const aggregation: any[] = [
      { $match: filter },
      {
        $lookup: {
          from: "employeeworkinformations",
          localField: "_id",
          foreignField: "employee_id",
          as: "employee_work_info",
        },
      },
      { $unwind: { path: "$employee_work_info", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          ...(department_id ? { "employee_work_info.department_id": new mongoose.Types.ObjectId(department_id) } : {}),
          ...(job_position_id ? { "employee_work_info.job_position_id": new mongoose.Types.ObjectId(job_position_id) } : {}),
        }
      },
    ];

    const [results] = await Employee.aggregate([
      ...aggregation,
      {
        $facet: {
          data: [
            { $sort: { employee_first_name: 1 } },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const employees = results.data.map((e: Record<string, unknown>) => {
      const { employee_work_info, ...rest } = e;
      return { ...rest, employee_work_info: employee_work_info || null };
    });

    const total = results.totalCount[0]?.count || 0;

    return NextResponse.json({
      data: employees,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("Employees list error:", err);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  let payload: { role?: string };
  try {
    payload = await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (payload.role || "EMPLOYEE") as "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
  if (!canManageEmployees(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      employee_first_name,
      employee_last_name,
      email,
      phone,
      badge_id,
      gender,
      dob,
      address,
      city,
      state,
      country,
      zip,
      marital_status,
      children,
      qualification,
      experience,
      emergency_contact,
      emergency_contact_name,
      emergency_contact_relation,
      department_id,
      job_position_id,
      reporting_manager_id,
      company_id,
      date_joining,
    } = body;

    if (!employee_first_name || !email) {
      return NextResponse.json(
        { error: "First name and email are required" },
        { status: 400 }
      );
    }

    const existing = await Employee.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An employee with this email already exists" },
        { status: 400 }
      );
    }

    const employee = await Employee.create({
      employee_first_name,
      employee_last_name: employee_last_name || "",
      email,
      phone: phone || "",
      badge_id: badge_id || undefined,
      gender: gender || "male",
      dob: dob ? new Date(dob) : null,
      address: address || null,
      city: city || null,
      state: state || null,
      country: country || null,
      zip: zip || null,
      marital_status: marital_status || "single",
      children: children ? parseInt(children) || 0 : 0,
      qualification: qualification || null,
      experience: experience ? parseInt(experience) || 0 : 0,
      emergency_contact: emergency_contact || null,
      emergency_contact_name: emergency_contact_name || null,
      emergency_contact_relation: emergency_contact_relation || null,
      is_active: true,
    });

    await EmployeeWorkInformation.create({
      employee_id: employee._id,
      department_id: department_id || null,
      job_position_id: job_position_id || null,
      reporting_manager_id: reporting_manager_id || null,
      company_id: company_id || null,
      date_joining: date_joining ? new Date(date_joining) : null,
      email: email, // Work email usually same as personal initially
      mobile: phone || null,
      experience: experience ? parseInt(experience) || 0 : 0,
    });

    const populated = await Employee.findById(employee._id)
      .populate({ path: "employee_work_info", strictPopulate: false })
      .lean();

    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    console.error("Employee create error:", err);
    return NextResponse.json(
      { error: "Failed to create employee" },
      { status: 500 }
    );
  }
}
