import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import { canManageLeave } from "@/lib/rbac";
import LeaveRequest from "@/models/LeaveRequest";

// Fixed: moved connectDB to handlers

export async function PUT(req: NextRequest) {
    await connectDB();
  try {
    const { id } = await params;
    const payload = await getDataFromToken(req);
    const role = (payload.role || "EMPLOYEE") as
      | "ADMIN"
      | "HR_MANAGER"
      | "MANAGER"
      | "EMPLOYEE";
    
    const body = await req.json();
    const { status, reject_reason } = body;

    const leaveRequest = await LeaveRequest.findById(id).lean();
    if (!leaveRequest) {
      return NextResponse.json({ error: "Leave request not found" }, { status: 404 });
    }

    const isOwnRequest = leaveRequest.employee_id?.toString() === payload.id;
    const isCancelling = status === "cancelled";

    if (!canManageLeave(role) && !(isOwnRequest && isCancelling)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!["approved", "rejected", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be approved, rejected, or cancelled." },
        { status: 400 }
      );
    }
    const update: Record<string, unknown> = { status };
    if (status === "rejected" && reject_reason) {
      update.reject_reason = reject_reason;
    }
    const updated = await LeaveRequest.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();
    return NextResponse.json(updated);
  } catch (e) {
    if ((e as { message?: string })?.message?.includes("token")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to update leave request" },
      { status: 500 }
    );
  }
}
