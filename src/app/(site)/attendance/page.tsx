"use client";

import { useEffect, useState } from "react";
import { Search, CalendarCheck, Clock } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/utils/api";

interface AttendanceRecord {
  _id: string;
  employee_id?: {
    _id?: string;
    employee_first_name?: string;
    employee_last_name?: string;
    badge_id?: string;
  } | null;
  attendance_date?: string;
  attendance_clock_in?: string;
  attendance_clock_in_date?: string;
  attendance_clock_out?: string;
  attendance_clock_out_date?: string;
  attendance_worked_hour?: string;
  minimum_hour?: string;
  shift_id?: { shift_name?: string } | null;
}

function formatTime(val?: string) {
  if (!val) return "—";
  return val;
}

function formatDate(val?: string) {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return val;
  }
}

export default function AttendancesPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    apiRequest("GET", "/attendance")
      .then((json) => {
        setRecords(json.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const today = new Date().toISOString().split("T")[0];
    return dateStr.startsWith(today);
  };

  const [dateFilter, setDateFilter] = useState<"all" | "today">("all");

  const filtered = records.filter((r) => {
    const matchesSearch = () => {
      if (!search) return true;
      const q = search.toLowerCase();
      const name =
        `${r.employee_id?.employee_first_name || ""} ${r.employee_id?.employee_last_name || ""}`.toLowerCase();
      const badge = (r.employee_id?.badge_id || "").toLowerCase();
      return name.includes(q) || badge.includes(q);
    };

    const matchesDate = () => {
      if (dateFilter === "all") return true;
      return isToday(r.attendance_date || r.attendance_clock_in_date);
    };

    return matchesSearch() && matchesDate();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-24 inline-block" />
            ) : (
              `${filtered.length} record${filtered.length !== 1 ? "s" : ""} found`
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={dateFilter === "today" ? "default" : "outline"}
            size="sm"
            onClick={() =>
              setDateFilter((prev) => (prev === "today" ? "all" : "today"))
            }
            className="gap-2"
          >
            <CalendarCheck className="size-4" />
            Today
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or badge..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Employee</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Clock In</TableHead>
                <TableHead className="font-semibold">Clock Out</TableHead>
                <TableHead className="font-semibold">Worked</TableHead>
                <TableHead className="font-semibold">Shift</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-10 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length ? (
                filtered.map((r) => {
                  const empName = r.employee_id
                    ? `${r.employee_id.employee_first_name || ""} ${r.employee_id.employee_last_name || ""}`.trim()
                    : "Unknown";
                  return (
                    <TableRow
                      key={r._id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{empName}</p>
                          {r.employee_id?.badge_id && (
                            <p className="text-xs text-muted-foreground">
                              {r.employee_id.badge_id}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(
                          r.attendance_date || r.attendance_clock_in_date,
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Clock className="size-3.5 text-emerald-500" />
                          {formatTime(r.attendance_clock_in)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Clock className="size-3.5 text-rose-500" />
                          {formatTime(r.attendance_clock_out)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium"
                        >
                          {r.attendance_worked_hour || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {r.shift_id?.shift_name || "—"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <CalendarCheck className="size-7 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        No attendance records found
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
