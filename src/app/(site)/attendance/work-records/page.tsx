"use client";

import { Search, Download, Calendar } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const records = [
  { id: "1", employee: "Adam Smith", avatar: "AS", dept: "Engineering", date: "2026-02-11", workType: "Office", shift: "Morning", workedHours: "9:00", breakHours: "1:00" },
  { id: "2", employee: "Sarah Johnson", avatar: "SJ", dept: "Engineering", date: "2026-02-11", workType: "Remote", shift: "Morning", workedHours: "9:15", breakHours: "1:00" },
  { id: "3", employee: "Emily Turner", avatar: "ET", dept: "Marketing", date: "2026-02-11", workType: "Office", shift: "Morning", workedHours: "9:00", breakHours: "0:45" },
  { id: "4", employee: "Kaviyarasan R", avatar: "KR", dept: "Engineering", date: "2026-02-11", workType: "Remote", shift: "Flexible", workedHours: "9:15", breakHours: "1:00" },
  { id: "5", employee: "Joel Ivanes", avatar: "JI", dept: "Support", date: "2026-02-11", workType: "Office", shift: "Evening", workedHours: "8:45", breakHours: "1:00" },
];

const workTypeColors: Record<string, string> = {
  Office: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Remote: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Hybrid: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
};

export default function WorkRecordsPage() {
  const [search, setSearch] = useState("");
  const filtered = records.filter((r) => r.employee.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Work Records</h1>
          <p className="text-sm text-muted-foreground">Detailed daily work records for all employees</p>
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
                <TableHead>Date</TableHead>
                <TableHead>Work Type</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Worked</TableHead>
                <TableHead>Break</TableHead>
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
                  <TableCell><Badge className={cn("text-[10px]", workTypeColors[r.workType])}>{r.workType}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{r.shift}</Badge></TableCell>
                  <TableCell className="font-medium">{r.workedHours}</TableCell>
                  <TableCell className="text-muted-foreground">{r.breakHours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
