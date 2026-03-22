import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import { canManageEmployees } from "@/lib/rbac";
import Employee from "@/models/Employee";
import EmployeeWorkInformation from "@/models/EmployeeWorkInformation";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest, { params }: any) {
    await connectDB();
  let payload: { role?: string; id?: string };
  try {
    payload = await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (payload.role || "EMPLOYEE") as "ADMIN" | "HR_MANAGER" | "MANAGER" | "EMPLOYEE";
  const { id } = await params;

  const [emp, workInfo] = await Promise.all([
    Employee.findById(id).lean(),
    EmployeeWorkInformation.findOne({ employee_id: id })
      .populate("department_id")
      .populate("job_position_id")
      .lean(),
  ]);

  if (!emp) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const employee = { ...emp, employee_work_info: workInfo ?? null };

  if (!canManageEmployees(role) && payload.id !== (employee as { employee_user_id?: unknown }).employee_user_id?.toString()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(employee);
}

export async function PUT(req: NextRequest, { params }: any) {
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

  const { id } = await params;
  const employee = await Employee.findById(id);
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const allowed = [
      "employee_first_name",
      "employee_last_name",
      "phone",
      "address",
      "country",
      "state",
      "city",
      "zip",
      "dob",
      "gender",
      "qualification",
      "experience",
      "marital_status",
      "children",
      "emergency_contact",
      "emergency_contact_name",
      "emergency_contact_relation",
      "badge_id",
      "is_active",
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) (employee as Record<string, unknown>)[key] = body[key];
    }
    await employee.save();

    const workInfo = await EmployeeWorkInformation.findOne({
      employee_id: id,
    });
    if (workInfo) {
      const workAllowed = [
        "department_id",
        "job_position_id",
        "job_role_id",
        "reporting_manager_id",
        "shift_id",
        "work_type_id",
        "employee_type_id",
        "company_id",
        "email",
        "mobile",
        "location",
        "date_joining",
        "contract_end_date",
        "basic_salary",
        "salary_hour",
      ];
      for (const key of workAllowed) {
        if (body[key] !== undefined) (workInfo as Record<string, unknown>)[key] = body[key];
      }
      await workInfo.save();
    }

    const [empDoc, workInfoDoc] = await Promise.all([
      Employee.findById(id).lean(),
      EmployeeWorkInformation.findOne({ employee_id: id }).lean(),
    ]);
    const updated = empDoc ? { ...empDoc, employee_work_info: workInfoDoc ?? null } : null;
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Employee update error:", err);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
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

  const { id } = await params;
  const employee = await Employee.findById(id);
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  try {
    employee.is_active = false;
    await employee.save();
    return NextResponse.json({ message: "Employee archived" });
  } catch (err) {
    console.error("Employee delete error:", err);
    return NextResponse.json(
      { error: "Failed to archive employee" },
      { status: 500 }
    );
  }
}
