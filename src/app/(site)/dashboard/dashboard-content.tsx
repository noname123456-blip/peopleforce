"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface DashboardMetrics {
  employeeCount: number;
  attendanceRate: number;
  leaveRequestsPending: number;
  openRecruitments: number;
  charts?: {
    attendanceTrend: { date: string; count: number }[];
    leaveByStatus: { name: string; value: number }[];
    employeesByDepartment: { name: string; value: number }[];
    recruitmentPipeline: { name: string; count: number }[];
  };
}

const CHART_COLORS = [
  "oklch(0.646 0.222 41.116)",
  "oklch(0.6 0.118 184.704)",
  "oklch(0.398 0.07 227.392)",
  "oklch(0.828 0.189 84.429)",
  "oklch(0.769 0.188 70.08)",
];

function formatDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function DashboardContent() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setMetrics(data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const charts = metrics?.charts;
  const cards = [
    {
      title: "Total Employees",
      value: metrics?.employeeCount ?? 0,
      sub: "Active",
    },
    {
      title: "Attendance Rate",
      value: `${metrics?.attendanceRate ?? 0}%`,
      sub: "This month",
    },
    {
      title: "Leave Pending",
      value: metrics?.leaveRequestsPending ?? 0,
      sub: "Awaiting approval",
    },
    {
      title: "Open Recruitments",
      value: metrics?.openRecruitments ?? 0,
      sub: "Active",
    },
  ];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-border bg-card p-6 text-card-foreground shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {card.title}
            </p>
            <p className="mt-2 text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Attendance trend - Area chart */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Attendance Trend (Last 7 Days)</h2>
          {charts?.attendanceTrend?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={charts.attendanceTrend.map((d) => ({
                  ...d,
                  label: formatDate(d.date),
                }))}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number | undefined) => [value ?? 0, "Check-ins"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={CHART_COLORS[0]}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              No attendance data for the last 7 days
            </p>
          )}
        </div>

        {/* Leave by status - Pie chart */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Leave Requests by Status (This Month)</h2>
          {charts?.leaveByStatus?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={charts.leaveByStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {charts.leaveByStatus.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => [value ?? 0, "Requests"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              No leave requests this month
            </p>
          )}
        </div>

        {/* Employees by department - Donut-style pie */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Employees by Department</h2>
          {charts?.employeesByDepartment?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={charts.employeesByDepartment}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {charts.employeesByDepartment.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => [value ?? 0, "Employees"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              No department data
            </p>
          )}
        </div>

        {/* Recruitment pipeline - Bar chart */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Candidates by Stage (Pipeline)</h2>
          {charts?.recruitmentPipeline?.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={charts.recruitmentPipeline}
                margin={{ top: 10, right: 10, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  angle={-35}
                  textAnchor="end"
                  height={60}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number | undefined) => [value ?? 0, "Candidates"]}
                  labelFormatter={(label) => `Stage: ${label}`}
                />
                <Bar
                  dataKey="count"
                  fill={CHART_COLORS[1]}
                  radius={[4, 4, 0, 0]}
                  name="Candidates"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
              No pipeline data
            </p>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium">Recent Activity</h2>
        <p className="text-sm text-muted-foreground">
          Recent activities will appear here. Connect your modules to populate this feed.
        </p>
      </div>
    </>
  );
}
