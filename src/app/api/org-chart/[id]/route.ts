import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import OrgChart from "@/models/OrgChart";
import { canManageEmployees } from "@/lib/rbac";

connectDB();

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getDataFromToken(req);
    const role = (payload.role || "EMPLOYEE") as any;
    if (!canManageEmployees(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const body = await req.json();
    if (body.parent_id === "" || body.parent_id === undefined) {
      body.parent_id = null;
    }
    const node = await OrgChart.findByIdAndUpdate(id, body, { new: true })
      .populate("employee_id", "employee_first_name employee_last_name employee_profile")
      .lean();

    if (!node) return NextResponse.json({ error: "Node not found" }, { status: 404 });
    return NextResponse.json(node);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await getDataFromToken(req);
    const role = (payload.role || "EMPLOYEE") as any;
    if (!canManageEmployees(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;

    // Find the node to act upon
    const node = await OrgChart.findById(id);
    if (!node) return NextResponse.json({ error: "Node not found" }, { status: 404 });

    // Promote direct reports to the manager's manager
    await OrgChart.updateMany({ parent_id: id }, { parent_id: node.parent_id });

    await OrgChart.findByIdAndDelete(id);

    return NextResponse.json({ message: "Node deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
