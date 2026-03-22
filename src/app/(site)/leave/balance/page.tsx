"use client";

import { useState } from "react";
import { Search, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useList } from "@/hooks/use-list";
import { PageLoader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function BalanceCell({ total, used }: { total: number; used: number }) {
  const available = total - used;
  const pct = (used / total) * 100;
  return (
    <div className="flex items-center gap-2">
      <Progress value={pct} className="h-1.5 w-16" />
      <span className="text-xs font-medium">{available}</span>
      <span className="text-[10px] text-muted-foreground">/ {total}</span>
    </div>
  );
}

export default function LeaveBalancePage() {
  const [search, setSearch] = useState("");
  const { data: allocations, loading } = useList<any>("/leave/allocations");

  const filtered = (allocations || []).filter((a: any) => {
    const name = `${a.employee_id?.employee_first_name || ""} ${a.employee_id?.employee_last_name || ""}`;
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leave Balance</h1>
          <p className="text-sm text-muted-foreground">
            View leave balances for all employees
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-[200px] pl-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-3.5" />
            Export
          </Button>
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Allocated Days</TableHead>
                  <TableHead>Carry Forward</TableHead>
                  <TableHead className="text-right">Total Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((a: any) => {
                  const name = `${a.employee_id?.employee_first_name || ""} ${a.employee_id?.employee_last_name || ""}`;
                  return (
                    <TableRow key={a._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {getInitials(name)}
                          </div>
                          <span className="font-medium">{name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {a.leave_type_id?.name || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {a.available_days} days
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {a.carryforward_days} days
                      </TableCell>
                      <TableCell className="text-right font-bold text-primary">
                        {a.total_leave_days} days
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
