"use client";

import { useState } from "react";
import { Search, Filter, Plus, CheckCircle2, XCircle, Clock, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const requests = [
  { id: "1", employee: "Sarah Johnson", avatar: "SJ", type: "Regularization", date: "2026-02-09", requestedCheckIn: "09:00", requestedCheckOut: "18:00", reason: "Forgot to check in", status: "Pending" },
  { id: "2", employee: "Mia Reed", avatar: "MR", type: "Overtime", date: "2026-02-08", requestedCheckIn: "09:00", requestedCheckOut: "21:00", reason: "Project deadline", status: "Approved" },
  { id: "3", employee: "Bob Smith", avatar: "BS", type: "Regularization", date: "2026-02-07", requestedCheckIn: "08:30", requestedCheckOut: "17:30", reason: "System error", status: "Rejected" },
  { id: "4", employee: "Emily Turner", avatar: "ET", type: "Correction", date: "2026-02-06", requestedCheckIn: "09:00", requestedCheckOut: "18:00", reason: "Wrong check-out time", status: "Pending" },
  { id: "5", employee: "Lucas Rogers", avatar: "LR", type: "Regularization", date: "2026-02-05", requestedCheckIn: "08:45", requestedCheckOut: "17:45", reason: "Badge not working", status: "Approved" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export default function AttendanceRequestsPage() {
  const [search, setSearch] = useState("");

  const filtered = requests.filter((r) =>
    r.employee.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance Requests</h1>
          <p className="text-sm text-muted-foreground">Manage attendance correction and regularization requests</p>
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
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{r.avatar}</div>
                      <span className="font-medium">{r.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{r.type}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell>{r.requestedCheckIn}</TableCell>
                  <TableCell>{r.requestedCheckOut}</TableCell>
                  <TableCell className="max-w-[150px] truncate text-muted-foreground">{r.reason}</TableCell>
                  <TableCell>
                    <Badge className={cn("text-[10px]", statusColors[r.status])}>{r.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {r.status === "Pending" && (
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-7"><CheckCircle2 className="size-3.5 text-emerald-500" /></Button>
                        <Button variant="ghost" size="icon" className="size-7"><XCircle className="size-3.5 text-destructive" /></Button>
                      </div>
                    )}
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
