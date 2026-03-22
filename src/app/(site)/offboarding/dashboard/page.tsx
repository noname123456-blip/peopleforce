"use client";

import { Users, CheckCircle2, Clock, FileText, ArrowUpRight, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Active Exits", value: 3, icon: Users, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/50" },
  { label: "Completed", value: 8, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/50" },
  { label: "Pending Tasks", value: 12, icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/50" },
  { label: "Resignations", value: 4, icon: FileText, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/50" },
];

const exitReasons = [
  { name: "Better Opportunity", value: 5, color: "#3b82f6" },
  { name: "Personal Reasons", value: 3, color: "#10b981" },
  { name: "Relocation", value: 2, color: "#f59e0b" },
  { name: "Career Change", value: 1, color: "#8b5cf6" },
];

const monthlyExits = [
  { month: "Sep", exits: 1 },
  { month: "Oct", exits: 2 },
  { month: "Nov", exits: 0 },
  { month: "Dec", exits: 3 },
  { month: "Jan", exits: 2 },
  { month: "Feb", exits: 1 },
];

export default function OffboardingDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Offboarding Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of exit processes and resignation tracking</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={cn("flex size-10 items-center justify-center rounded-lg", s.bg)}>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Exit Reasons</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={exitReasons} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                    {exitReasons.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {exitReasons.map((e) => (
                <div key={e.name} className="flex items-center gap-1.5 text-xs">
                  <div className="size-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                  <span className="text-muted-foreground">{e.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Monthly Exits</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyExits} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="exits" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
