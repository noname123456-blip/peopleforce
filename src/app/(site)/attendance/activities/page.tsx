"use client";

import { Search, Filter, Download, LogIn, LogOut, Clock } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const activities = [
  { id: "1", employee: "Adam Smith", avatar: "AS", action: "Check In", time: "09:00", date: "2026-02-11", ipAddress: "192.168.1.45", device: "Web Browser" },
  { id: "2", employee: "Sarah Johnson", avatar: "SJ", action: "Check In", time: "09:15", date: "2026-02-11", ipAddress: "192.168.1.89", device: "Mobile App" },
  { id: "3", employee: "Emily Turner", avatar: "ET", action: "Check In", time: "08:45", date: "2026-02-11", ipAddress: "192.168.1.22", device: "Web Browser" },
  { id: "4", employee: "Adam Smith", avatar: "AS", action: "Break Start", time: "12:00", date: "2026-02-11", ipAddress: "192.168.1.45", device: "Web Browser" },
  { id: "5", employee: "Adam Smith", avatar: "AS", action: "Break End", time: "13:00", date: "2026-02-11", ipAddress: "192.168.1.45", device: "Web Browser" },
  { id: "6", employee: "Emily Turner", avatar: "ET", action: "Check Out", time: "17:45", date: "2026-02-11", ipAddress: "192.168.1.22", device: "Web Browser" },
  { id: "7", employee: "Kaviyarasan R", avatar: "KR", action: "Check In", time: "08:55", date: "2026-02-11", ipAddress: "192.168.1.67", device: "Mobile App" },
];

const actionColors: Record<string, { color: string; icon: typeof LogIn }> = {
  "Check In": { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400", icon: LogIn },
  "Check Out": { color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400", icon: LogOut },
  "Break Start": { color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400", icon: Clock },
  "Break End": { color: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400", icon: Clock },
};

export default function AttendanceActivitiesPage() {
  const [search, setSearch] = useState("");
  const filtered = activities.filter((a) => a.employee.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Activities</h1>
          <p className="text-sm text-muted-foreground">Real-time attendance activity log</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-[200px] pl-9" />
          </div>
          <Button variant="outline" size="sm" className="gap-2"><Download className="size-3.5" />Export</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Device</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => {
                const config = actionColors[a.action];
                const Icon = config?.icon || Clock;
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{a.avatar}</div>
                        <span className="font-medium">{a.employee}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge className={cn("gap-1 text-[10px]", config?.color)}><Icon className="size-3" />{a.action}</Badge></TableCell>
                    <TableCell className="font-medium">{a.time}</TableCell>
                    <TableCell className="text-muted-foreground">{a.date}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{a.ipAddress}</TableCell>
                    <TableCell className="text-muted-foreground">{a.device}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
