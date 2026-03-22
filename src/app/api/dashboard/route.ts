import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/dbConfig";
import getDataFromToken from "@/utils/getDataFromToken";
import Employee from "@/models/Employee";
import Attendance from "@/models/Attendance";
import LeaveRequest from "@/models/LeaveRequest";
import Recruitment from "@/models/Recruitment";
import EmployeeWorkInformation from "@/models/EmployeeWorkInformation";
import Department from "@/models/Department";
import Candidate from "@/models/Candidate";

// Fixed: moved connectDB to handlers

export async function GET(req: NextRequest) {
    await connectDB();
  try {
    await getDataFromToken(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLast7 = new Date(now);
    startOfLast7.setDate(startOfLast7.getDate() - 6);
    startOfLast7.setHours(0, 0, 0, 0);

    const [
      employeeCount,
      leaveRequestsPending,
      openRecruitments,
      attendanceDocs,
      leaveByStatus,
      attendanceTrend,
      departmentCounts,
      recruitmentPipeline,
    ] = await Promise.all([
      Employee.countDocuments({ is_active: true }),
      LeaveRequest.countDocuments({ status: "requested" }),
      Recruitment.countDocuments({ closed: false }),
      Attendance.aggregate([
        {
          $match: {
            attendance_date: { $gte: startOfMonth, $lte: now },
          },
        },
        { $group: { _id: "$employee_id", count: { $sum: 1 } } },
        { $count: "total" },
      ]),
      LeaveRequest.aggregate([
        { $match: { requested_date: { $gte: startOfMonth } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Attendance.aggregate([
        {
          $match: {
            attendance_date: { $gte: startOfLast7, $lte: now },
          },
        },
        { $group: { _id: "$attendance_date", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      EmployeeWorkInformation.aggregate([
        { $match: { department_id: { $ne: null } } },
        { $group: { _id: "$department_id", count: { $sum: 1 } } },
        { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "dept" } },
        { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ["$dept.department", "Unassigned"] }, value: "$count" } },
      ]),
      Candidate.aggregate([
        { $match: { canceled: { $ne: true } } },
        { $group: { _id: "$stage_id", count: { $sum: 1 } } },
        { $lookup: { from: "stages", localField: "_id", foreignField: "_id", as: "stageDoc" } },
        { $unwind: { path: "$stageDoc", preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ["$stageDoc.stage", "Unknown"] }, count: 1 } },
      ]),
    ]);

    const attendanceCount = attendanceDocs[0]?.total ?? 0;
    const attendanceRate =
      employeeCount > 0
        ? Math.round((attendanceCount / (employeeCount * 30)) * 100)
        : 0;

    const trendMap = new Map(
      attendanceTrend.map((t: { _id: Date; count: number }) => [
        t._id.toISOString().slice(0, 10),
        t.count,
      ])
    );
    const last7Dates: { date: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfLast7);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      last7Dates.push({ date: key, count: trendMap.get(key) ?? 0 });
    }

    const leaveByStatusMap = leaveByStatus.map((s: { _id: string; count: number }) => ({
      name: s._id,
      value: s.count,
    }));

    return NextResponse.json({
      employeeCount,
      attendanceRate: Math.min(100, attendanceRate),
      leaveRequestsPending,
      openRecruitments,
      charts: {
        attendanceTrend: last7Dates,
        leaveByStatus: leaveByStatusMap,
        employeesByDepartment: departmentCounts.map((d: { name: string; value: number }) => ({
          name: d.name,
          value: d.value,
        })),
        recruitmentPipeline,
      },
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { error: "Failed to load dashboard metrics" },
      { status: 500 }
    );
  }
}
