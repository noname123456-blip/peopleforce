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

    const { searchParams } = new URL(req.url);
    const stage_id = searchParams.get("stage_id");
    const search = searchParams.get("search");

    const query: any = {};
    if (stage_id) query.stage_id = stage_id;

    let taskQuery = OnboardingTask.find(query)
      .populate("stage_id", "stage_title")
      .populate("candidates", "name email")
      .populate("employee_id", "employee_first_name employee_last_name")
      .sort({ createdAt: -1 });

    const tasks = await taskQuery.lean();

    const filtered = search
      ? tasks.filter((t: any) =>
          t.task_title.toLowerCase().includes(search.toLowerCase())
        )
      : tasks;

    return NextResponse.json({ data: filtered });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
    await connectDB();
  try {
    const payload = await getDataFromToken(req);
    if (!canManageOnboarding(payload.role as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const task = await OnboardingTask.create(body);
    return NextResponse.json(task, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create task" },
      { status: 500 }
    );
  }
}
