"use client";

import { Download, FileBarChart, Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { cn } from "@/lib/utils";

const monthlyData = [
  { month: "Sep", present: 92, absent: 5, late: 3 },
  { month: "Oct", present: 90, absent: 6, late: 4 },
  { month: "Nov", present: 94, absent: 3, late: 3 },
  { month: "Dec", present: 88, absent: 8, late: 4 },
  { month: "Jan", present: 91, absent: 5, late: 4 },
  { month: "Feb", present: 93, absent: 4, late: 3 },
];

export default function AttendanceReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Reports</h1>
          <p className="text-sm text-muted-foreground">Generate and export attendance reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="feb-2026">
            <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="feb-2026">Feb 2026</SelectItem>
              <SelectItem value="jan-2026">Jan 2026</SelectItem>
              <SelectItem value="dec-2025">Dec 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-2"><Download className="size-3.5" />Export PDF</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="size-3.5" />Export CSV</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Avg. Attendance", value: "91.3%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/50" },
          { label: "Total Working Days", value: "22", icon: Calendar, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/50" },
          { label: "Total Employees", value: "165", icon: Users, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-950/50" },
          { label: "Avg. Hours/Day", value: "8.5h", icon: Clock, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/50" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={cn("flex size-10 items-center justify-center rounded-lg", s.bg)}>
                <s.icon className={cn("size-5", s.color)} />
              </div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Monthly Attendance Rate (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} domain={[80, 100]} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="present" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="absent" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="late" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Daily Report", desc: "Detailed daily attendance for all employees", icon: FileBarChart },
          { title: "Monthly Summary", desc: "Monthly attendance statistics per employee", icon: Calendar },
          { title: "Department Report", desc: "Attendance breakdown by department", icon: Users },
          { title: "Late/Early Report", desc: "Detailed late arrivals and early departures", icon: Clock },
          { title: "Overtime Report", desc: "Employee overtime hours tracking", icon: TrendingUp },
          { title: "Leave Integration", desc: "Combined attendance and leave report", icon: Calendar },
        ].map((r) => (
          <Card key={r.title} className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <r.icon className="size-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{r.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.desc}</p>
                <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs text-primary">
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
