import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import AvailableLeave from "@/models/AvailableLeave";
import Employee from "@/models/Employee";
import LeaveRequest from "@/models/LeaveRequest";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
    try {
        const payload = await getDataFromToken(req);
        const emp = await Employee.findOne({ employee_user_id: payload.id }).lean();
        if (!emp) return NextResponse.json({ data: [] });

        // Fetch allocations
        const allocations = await AvailableLeave.find({ employee_id: emp._id })
            .populate("leave_type_id", "name")
            .lean();

        // Fetch used days (approved requests)
        const usedDays = await LeaveRequest.aggregate([
            { $match: { employee_id: emp._id, status: "approved" } },
            { $group: { _id: "$leave_type_id", total: { $sum: "$requested_days" } } }
        ]);

        // Fetch pending days
        const pendingDays = await LeaveRequest.aggregate([
            { $match: { employee_id: emp._id, status: "requested" } },
            { $group: { _id: "$leave_type_id", total: { $sum: "$requested_days" } } }
        ]);

        const usedMap = new Map(usedDays.map(d => [d._id.toString(), d.total]));
        const pendingMap = new Map(pendingDays.map(d => [d._id.toString(), d.total]));

        const result = allocations.map((a: any) => ({
            _id: a._id,
            leave_type_id: a.leave_type_id,
            available_days: a.available_days + a.carryforward_days, // Total allocated
            used_days: usedMap.get(a.leave_type_id?._id?.toString()) || 0,
            requests_pending: pendingMap.get(a.leave_type_id?._id?.toString()) || 0,
        }));

        return NextResponse.json({ data: result });
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to fetch availability" },
            { status: 500 },
        );
    }
}
