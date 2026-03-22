"use client";
import { useList } from "@/hooks/use-list";
import { PageLoader } from "@/components/ui/loader";
import { formatDate } from "@/utils/formatters";
import { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, Calendar } from "lucide-react"; // Added missing imports for icons
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming these are available
import { cn } from "@/lib/utils"; // Assuming this is available
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts"; // Assuming these are available
import { Button } from "@/components/ui/button"; // Assuming this is available
import { Badge } from "@/components/ui/badge"; // Assuming this is available
import { useRouter } from "next/navigation"; // Corrected from next/router

const monthlyLeaves = [
  { month: "Sep", count: 15 },
  { month: "Oct", count: 22 },
  { month: "Nov", count: 18 },
  { month: "Dec", count: 30 },
  { month: "Jan", count: 20 },
  { month: "Feb", count: 12 },
];

const statusColors: Record<string, string> = {
  requested:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400", // Changed Pending to requested
  approved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400", // Changed Approved to approved
  rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400", // Changed Rejected to rejected
};

export default function LeaveDashboardPage() {
  const router = useRouter(); // Assuming router is used for navigation
  const { data: requests, loading } = useList<any>("/leave/requests", {
    defaultLimit: 50,
  });

  const pendingCount = (requests || []).filter(
    (r) => r.status === "requested",
  ).length;
  const approvedToday = (requests || []).filter(
    (r) =>
      r.status === "approved" &&
      new Date(r.updatedAt).toDateString() === new Date().toDateString(),
  ).length;
  const rejectedToday = (requests || []).filter(
    (r) =>
      r.status === "rejected" &&
      new Date(r.updatedAt).toDateString() === new Date().toDateString(),
  ).length;

  // Basic grouping for pie chart
  const typeCounts = (requests || []).reduce((acc: any, r: any) => {
    const type = r.leave_type_id?.name || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const leaveByTypeData = Object.entries(typeCounts).map(
    ([name, value], i) => ({
      name,
      value,
      color: ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][i % 5],
    }),
  );

  const stats = [
    {
      label: "Pending Requests",
      value: pendingCount,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      label: "Approved Today",
      value: approvedToday,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: "Rejected Today",
      value: rejectedToday,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-950/50",
    },
    {
      label: "Total Requests",
      value: (requests || []).length,
      icon: Calendar,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
  ];

  const recentRequests = (requests || []).slice(0, 5);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Leave Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of leave requests and statistics
        </p>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg",
                      s.bg,
                    )}
                  >
                    <s.icon className={cn("size-5", s.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Leave by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leaveByTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {leaveByTypeData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  {leaveByTypeData.map((t) => (
                    <div
                      key={t.name}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <div
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                      <span className="text-muted-foreground">{t.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Monthly Leave Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyLeaves} barSize={32}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "hsl(var(--popover))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Recent Leave Requests</CardTitle>
              <Button
                variant="link"
                size="sm"
                className="text-primary"
                onClick={() => router.push("/leave/requests")}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentRequests.map((r: any, i: number) => {
                const name = `${r.employee_id?.employee_first_name || ""} ${r.employee_id?.employee_last_name || ""}`;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3"
                  >
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {getInitials(name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.leave_type_id?.name || "Other"} &middot;{" "}
                        {formatDate(r.start_date)} - {formatDate(r.end_date)} (
                        {r.requested_days}d)
                      </p>
                    </div>
                    <Badge
                      className={cn(
                        "text-[10px]",
                        statusColors[r.status] ||
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {r.status}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
