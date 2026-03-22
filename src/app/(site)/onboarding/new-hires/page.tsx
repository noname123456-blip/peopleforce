"use client";

import { Search, UserPlus } from "lucide-react";
import { useState } from "react";
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
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { useList } from "@/hooks/use-list";
import Link from "next/link";

export default function NewHiresPage() {
  const [search, setSearch] = useState("");
  const { data: employees, loading } = useList<any>("/employees", {
    defaultLimit: 50,
  });

  // Sort by most recently created and show recent hires (last 90 days)
  const recentHires = employees
    .filter((e: any) => {
      const joinDate = e.employee_work_info?.date_joining
        ? new Date(e.employee_work_info.date_joining)
        : e.createdAt
          ? new Date(e.createdAt)
          : null;
      if (!joinDate) return true; // Show if no date — it could be recent
      const daysAgo = (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 90;
    })
    .filter((e: any) => {
      const name =
        `${e.employee_first_name || ""} ${e.employee_last_name || ""}`.toLowerCase();
      return name.includes(search.toLowerCase());
    });

  function getInitials(first: string, last?: string) {
    return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase() || "?";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Hires</h1>
          <p className="text-sm text-muted-foreground">
            Recently hired employees (last 90 days)
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
          <Link href="/employees?create=true">
            <Button size="sm" className="gap-2">
              <UserPlus className="size-3.5" />
              Create
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader variant="dots" />
        </div>
      ) : recentHires.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>No recent hires found.</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentHires.map((e: any) => {
                  const dept =
                    typeof e.employee_work_info?.department_id === "object"
                      ? e.employee_work_info.department_id?.department
                      : "—";
                  const position =
                    typeof e.employee_work_info?.job_position_id === "object"
                      ? e.employee_work_info.job_position_id?.job_position
                      : "—";
                  const joinDate = e.employee_work_info?.date_joining
                    ? new Date(
                        e.employee_work_info.date_joining,
                      ).toLocaleDateString()
                    : e.createdAt
                      ? new Date(e.createdAt).toLocaleDateString()
                      : "—";

                  return (
                    <TableRow key={e._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {getInitials(
                              e.employee_first_name,
                              e.employee_last_name,
                            )}
                          </div>
                          <span className="font-medium">
                            {e.employee_first_name} {e.employee_last_name || ""}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {e.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {dept}
                      </TableCell>
                      <TableCell>{position}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {joinDate}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-[10px]",
                            e.is_active !== false
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
                          )}
                        >
                          {e.is_active !== false ? "Active" : "Inactive"}
                        </Badge>
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
