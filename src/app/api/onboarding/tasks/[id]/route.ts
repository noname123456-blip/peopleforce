import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import OnboardingTask from "@/models/OnboardingTask";
import { canManageOnboarding } from "@/lib/rbac";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    if (!canManageOnboarding(payload.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const task = await OnboardingTask.findById(id)
      .populate("stage_id", "stage_title")
      .populate("candidates", "name email")
      .populate("employee_id", "employee_first_name employee_last_name")
      .lean();

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    if (!canManageOnboarding(payload.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const task = await OnboardingTask.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    if (!canManageOnboarding(payload.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const task = await OnboardingTask.findByIdAndDelete(id);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete task" },
      { status: 500 }
    );
  }
}
