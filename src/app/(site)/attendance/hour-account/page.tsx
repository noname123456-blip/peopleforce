"use client";

import { Search, Download, Clock } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const data = [
  { employee: "Adam Smith", avatar: "AS", dept: "Engineering", month: "Feb 2026", totalHours: 72, requiredHours: 80, overtime: 0 },
  { employee: "Sarah Johnson", avatar: "SJ", dept: "Engineering", month: "Feb 2026", totalHours: 68, requiredHours: 80, overtime: 0 },
  { employee: "Emily Turner", avatar: "ET", dept: "Marketing", month: "Feb 2026", totalHours: 78, requiredHours: 80, overtime: 2 },
  { employee: "Kaviyarasan R", avatar: "KR", dept: "Engineering", month: "Feb 2026", totalHours: 85, requiredHours: 80, overtime: 5 },
  { employee: "Joel Ivanes", avatar: "JI", dept: "Support", month: "Feb 2026", totalHours: 76, requiredHours: 80, overtime: 0 },
  { employee: "Charlotte Brooks", avatar: "CB", dept: "Sales", month: "Feb 2026", totalHours: 80, requiredHours: 80, overtime: 0 },
];

export default function HourAccountPage() {
  const [search, setSearch] = useState("");
  const filtered = data.filter((d) => d.employee.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hour Account</h1>
          <p className="text-sm text-muted-foreground">Track employee working hours against requirements</p>
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
                <TableHead>Department</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Worked</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Overtime</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d, i) => {
                const pct = Math.min((d.totalHours / d.requiredHours) * 100, 100);
                return (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">{d.avatar}</div>
                        <span className="font-medium">{d.employee}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{d.dept}</TableCell>
                    <TableCell className="text-muted-foreground">{d.month}</TableCell>
                    <TableCell className="font-medium">{d.totalHours}h</TableCell>
                    <TableCell className="text-muted-foreground">{d.requiredHours}h</TableCell>
                    <TableCell className="w-[150px]">
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-2 flex-1" />
                        <span className="text-xs text-muted-foreground">{Math.round(pct)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {d.overtime > 0 ? (
                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 text-[10px]">+{d.overtime}h</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
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
