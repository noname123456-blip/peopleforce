"use client";

import { useState } from "react";
import { Search, Plus, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const allocations = [
  { id: "1", employee: "Sarah Johnson", avatar: "SJ", leaveType: "Annual Leave", requestedDays: 5, reason: "Extra vacation days", status: "Pending" },
  { id: "2", employee: "Bob Smith", avatar: "BS", leaveType: "Sick Leave", requestedDays: 3, reason: "Medical treatment", status: "Approved" },
  { id: "3", employee: "Emily Turner", avatar: "ET", leaveType: "Casual Leave", requestedDays: 2, reason: "Moving house", status: "Approved" },
  { id: "4", employee: "Lucas Rogers", avatar: "LR", leaveType: "Annual Leave", requestedDays: 10, reason: "Extended vacation", status: "Rejected" },
  { id: "5", employee: "Mia Reed", avatar: "MR", leaveType: "Compensatory Off", requestedDays: 2, reason: "Worked on weekend", status: "Pending" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export default function AllocationRequestPage() {
  const [search, setSearch] = useState("");
  const filtered = allocations.filter((a) => a.employee.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Allocation Requests</h1>
          <p className="text-sm text-muted-foreground">Manage leave allocation requests from employees</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="h-9 w-[200px] pl-9" />
          </div>
          <Button size="sm" className="gap-2"><Plus className="size-3.5" />New Allocation</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Requested Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{a.avatar}</div>
                      <span className="font-medium">{a.employee}</span>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{a.leaveType}</Badge></TableCell>
                  <TableCell className="font-medium">{a.requestedDays} days</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{a.reason}</TableCell>
                  <TableCell><Badge className={cn("text-[10px]", statusColors[a.status])}>{a.status}</Badge></TableCell>
                  <TableCell>
                    {a.status === "Pending" && (
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
