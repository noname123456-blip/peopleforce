import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import AvailableLeave from "@/models/AvailableLeave";
import { canManageLeave } from "@/lib/rbac";
import Employee from "@/models/Employee";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
    try {
        const payload = await getDataFromToken(req);
        const role = (payload.role || "EMPLOYEE") as any;

        const { searchParams } = new URL(req.url);
        const employeeId = searchParams.get("employee_id");

        let filter: Record<string, any> = {};

        if (!canManageLeave(role)) {
            const emp = await Employee.findOne({ employee_user_id: payload.id }).lean();
            if (emp) filter.employee_id = emp._id;
            else return NextResponse.json({ data: [] });
        } else if (employeeId) {
            filter.employee_id = employeeId;
        }

        const list = await AvailableLeave.find(filter)
            .populate("leave_type_id", "name")
            .populate("employee_id", "employee_first_name employee_last_name")
            .lean();

        return NextResponse.json({ data: list });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to fetch allocations" },
            { status: 500 },
        );
    }
}

export async function POST(req: NextRequest) {
    await connectDB();
    try {
        await getDataFromToken(req);
        const body = await req.json();

        if (!body.employee_id || !body.leave_type_id) {
            return NextResponse.json({ error: "Employee and leave type are required" }, { status: 400 });
        }

        const doc = await AvailableLeave.findOneAndUpdate(
            { employee_id: body.employee_id, leave_type_id: body.leave_type_id },
            { $set: body },
            { upsert: true, new: true }
        );

        return NextResponse.json(doc, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to assign leave" },
            { status: 500 },
        );
    }
}
