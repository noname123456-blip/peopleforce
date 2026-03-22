"use client";

import { Search, Filter, Eye, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const exitProcesses = [
  { id: "1", employee: "Charlotte Brooks", avatar: "CB", dept: "Sales", lastDay: "2026-02-28", reason: "Better Opportunity", progress: 60, tasks: { done: 3, total: 5 }, status: "In Progress" },
  { id: "2", employee: "William Peterson", avatar: "WP", dept: "Engineering", lastDay: "2026-03-15", reason: "Relocation", progress: 20, tasks: { done: 1, total: 5 }, status: "In Progress" },
  { id: "3", employee: "Bob Smith", avatar: "BS", dept: "Engineering", lastDay: "2026-02-20", reason: "Career Change", progress: 100, tasks: { done: 5, total: 5 }, status: "Completed" },
  { id: "4", employee: "Mia Reed", avatar: "MR", dept: "Engineering", lastDay: "2026-03-31", reason: "Personal Reasons", progress: 0, tasks: { done: 0, total: 5 }, status: "Not Started" },
];

const statusColors: Record<string, string> = {
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  "Not Started": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export default function ExitProcessPage() {
  const [search, setSearch] = useState("");
  const filtered = exitProcesses.filter((e) => e.employee.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exit Process</h1>
          <p className="text-sm text-muted-foreground">Manage employee exit and offboarding checklists</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-[200px] pl-9" />
          </div>
          <Button variant="outline" size="sm" className="gap-2"><Filter className="size-3.5" />Filter</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Last Working Day</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((e) => (
                <TableRow key={e.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{e.avatar}</div>
                      <span className="font-medium">{e.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{e.dept}</TableCell>
                  <TableCell className="text-muted-foreground">{e.lastDay}</TableCell>
                  <TableCell>{e.reason}</TableCell>
                  <TableCell className="w-[150px]">
                    <div className="flex items-center gap-2">
                      <Progress value={e.progress} className="h-2 flex-1" />
                      <span className="text-xs">{e.tasks.done}/{e.tasks.total}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge className={cn("text-[10px]", statusColors[e.status])}>{e.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="size-7"><Eye className="size-3.5 text-muted-foreground" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
