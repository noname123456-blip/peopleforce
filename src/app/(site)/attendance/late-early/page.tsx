"use client";

import { useState } from "react";
import { Search, Filter, AlertTriangle, Clock, ArrowDown, ArrowUp, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const records = [
  { id: "1", employee: "Sarah Johnson", avatar: "SJ", dept: "Engineering", date: "2026-02-11", type: "Late Come", scheduledTime: "09:00", actualTime: "09:15", diff: "15 min" },
  { id: "2", employee: "Mia Reed", avatar: "MR", dept: "Engineering", date: "2026-02-11", type: "Late Come", scheduledTime: "09:00", actualTime: "09:30", diff: "30 min" },
  { id: "3", employee: "Bob Smith", avatar: "BS", dept: "Engineering", date: "2026-02-10", type: "Early Out", scheduledTime: "18:00", actualTime: "16:30", diff: "1h 30m" },
  { id: "4", employee: "Emily Turner", avatar: "ET", dept: "Marketing", date: "2026-02-09", type: "Late Come", scheduledTime: "09:00", actualTime: "09:20", diff: "20 min" },
  { id: "5", employee: "Lucas Rogers", avatar: "LR", dept: "Sales", date: "2026-02-09", type: "Early Out", scheduledTime: "18:00", actualTime: "17:00", diff: "1h 00m" },
  { id: "6", employee: "William Peterson", avatar: "WP", dept: "Engineering", date: "2026-02-08", type: "Late Come", scheduledTime: "09:00", actualTime: "09:45", diff: "45 min" },
];

export default function LateEarlyPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = records.filter((r) => {
    const matchesSearch = r.employee.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const lateCount = records.filter((r) => r.type === "Late Come").length;
  const earlyCount = records.filter((r) => r.type === "Early Out").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Late Come / Early Out</h1>
          <p className="text-sm text-muted-foreground">Track and manage attendance irregularities</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-[200px] pl-9" />
          </div>
          <Button variant="outline" size="sm" className="gap-2"><Download className="size-3.5" />Export</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button onClick={() => setTypeFilter(typeFilter === "Late Come" ? "all" : "Late Come")} className={cn("flex items-center gap-4 rounded-xl border p-5 text-left transition-all", typeFilter === "Late Come" ? "border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30" : "border-border bg-card hover:bg-accent/50")}>
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50"><ArrowDown className="size-5 text-amber-500" /></div>
          <div>
            <p className="text-xl font-bold">{lateCount}</p>
            <p className="text-xs text-muted-foreground">Late Arrivals (This Week)</p>
          </div>
        </button>
        <button onClick={() => setTypeFilter(typeFilter === "Early Out" ? "all" : "Early Out")} className={cn("flex items-center gap-4 rounded-xl border p-5 text-left transition-all", typeFilter === "Early Out" ? "border-blue-300 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/30" : "border-border bg-card hover:bg-accent/50")}>
          <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50"><ArrowUp className="size-5 text-blue-500" /></div>
          <div>
            <p className="text-xl font-bold">{earlyCount}</p>
            <p className="text-xs text-muted-foreground">Early Departures (This Week)</p>
          </div>
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scheduled</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Difference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{r.avatar}</div>
                      <span className="font-medium">{r.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.dept}</TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-[10px]", r.type === "Late Come" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400" : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400")}>{r.type}</Badge>
                  </TableCell>
                  <TableCell>{r.scheduledTime}</TableCell>
                  <TableCell className="font-medium">{r.actualTime}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px] font-mono">{r.diff}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
