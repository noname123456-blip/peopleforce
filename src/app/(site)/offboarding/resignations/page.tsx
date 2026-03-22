"use client";

import { useState } from "react";
import { Search, Filter, CheckCircle2, XCircle, Clock, Eye, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const resignations = [
  { id: "1", employee: "Charlotte Brooks", avatar: "CB", dept: "Sales", submittedDate: "2026-01-15", noticePeriod: "30 days", lastDay: "2026-02-28", reason: "Better opportunity", status: "Approved" },
  { id: "2", employee: "William Peterson", avatar: "WP", dept: "Engineering", submittedDate: "2026-01-20", noticePeriod: "60 days", lastDay: "2026-03-15", reason: "Relocating abroad", status: "Approved" },
  { id: "3", employee: "Bob Smith", avatar: "BS", dept: "Engineering", submittedDate: "2026-01-10", noticePeriod: "30 days", lastDay: "2026-02-20", reason: "Career change", status: "Completed" },
  { id: "4", employee: "Mia Reed", avatar: "MR", dept: "Engineering", submittedDate: "2026-02-01", noticePeriod: "60 days", lastDay: "2026-03-31", reason: "Personal reasons", status: "Pending" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  Approved: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Rejected: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

export default function ResignationsPage() {
  const [search, setSearch] = useState("");
  const filtered = resignations.filter((r) => r.employee.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resignation Letters</h1>
          <p className="text-sm text-muted-foreground">Manage and process employee resignation requests</p>
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
                <TableHead>Submitted</TableHead>
                <TableHead>Notice Period</TableHead>
                <TableHead>Last Day</TableHead>
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
                  <TableCell className="text-muted-foreground">{r.dept}</TableCell>
                  <TableCell className="text-muted-foreground">{r.submittedDate}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{r.noticePeriod}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{r.lastDay}</TableCell>
                  <TableCell className="max-w-[150px] truncate text-muted-foreground">{r.reason}</TableCell>
                  <TableCell><Badge className={cn("text-[10px]", statusColors[r.status])}>{r.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="size-7"><Eye className="size-3.5 text-muted-foreground" /></Button>
                      {r.status === "Pending" && (
                        <>
                          <Button variant="ghost" size="icon" className="size-7"><CheckCircle2 className="size-3.5 text-emerald-500" /></Button>
                          <Button variant="ghost" size="icon" className="size-7"><XCircle className="size-3.5 text-destructive" /></Button>
                        </>
                      )}
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
