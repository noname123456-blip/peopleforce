"use client";

import {
  Clock,
  UserCheck,
  UserX,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Present Today", value: 142, total: 165, icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/50", change: 3.2 },
  { label: "Absent Today", value: 12, total: 165, icon: UserX, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/50", change: -1.5 },
  { label: "Late Arrivals", value: 8, total: 142, icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/50", change: -2.1 },
  { label: "On Leave", value: 11, total: 165, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/50", change: 1.8 },
];

const weeklyTrend = [
  { day: "Mon", present: 140, absent: 15, late: 8 },
  { day: "Tue", present: 148, absent: 10, late: 5 },
  { day: "Wed", present: 135, absent: 18, late: 12 },
  { day: "Thu", present: 142, absent: 12, late: 8 },
  { day: "Fri", present: 130, absent: 20, late: 15 },
  { day: "Sat", present: 45, absent: 5, late: 2 },
];

const departmentAttendance = [
  { dept: "Engineering", rate: 92 },
  { dept: "Marketing", rate: 88 },
  { dept: "Sales", rate: 95 },
  { dept: "Support", rate: 85 },
  { dept: "HR", rate: 97 },
  { dept: "Finance", rate: 91 },
];

const attendanceDistribution = [
  { name: "Present", value: 142, color: "#10b981" },
  { name: "Absent", value: 12, color: "#ef4444" },
  { name: "On Leave", value: 11, color: "#3b82f6" },
];

export default function AttendanceDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Today&apos;s attendance overview and weekly trends
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={cn("flex size-10 items-center justify-center rounded-lg", stat.bg)}>
                  <stat.icon className={cn("size-5", stat.color)} />
                </div>
                <div className={cn(
                  "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                  stat.change > 0
                    ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                    : "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                )}>
                  {stat.change > 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {Math.abs(stat.change)}%
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <Progress value={(stat.value / stat.total) * 100} className="mt-3 h-1.5" />
              <p className="mt-1 text-[10px] text-muted-foreground">
                {stat.value} of {stat.total} employees
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Weekly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="present" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="late" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex justify-center gap-6">
              {[{ label: "Present", color: "#10b981" }, { label: "Late", color: "#f59e0b" }, { label: "Absent", color: "#ef4444" }].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-muted-foreground">{l.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribution Pie */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Today&apos;s Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={attendanceDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                    {attendanceDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {attendanceDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-muted-foreground">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Attendance */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Department Attendance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentAttendance} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="dept" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} formatter={(value: number | undefined) => [`${value ?? 0}%`, "Rate"]} />
                <Bar dataKey="rate" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
