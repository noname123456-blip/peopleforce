"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Search,
  Users,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  BadgeCheck,
  RotateCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateEmployeeDialog from "@/components/employees/CreateEmployeeDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";

interface EmployeeListItem {
  _id: string;
  employee_first_name: string;
  employee_last_name?: string;
  email: string;
  phone?: string;
  badge_id?: string;
  is_active?: boolean;
  gender?: string;
  employee_profile?: string | null;
  employee_work_info?: {
    department_id?: { department?: string } | string | null;
    job_position_id?: { job_position?: string } | string | null;
    date_joining?: string;
  } | null;
}

interface PaginationInfo {
  page: number;
  total: number;
  pages: number;
  limit: number;
}

function getInitials(first: string, last?: string) {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase() || "?";
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-pink-500",
  ];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return colors[idx % colors.length];
}

export default function EmployeesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setIsCreateOpen(true);
      // Optional: clear the param after opening
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("create");
      router.replace(`/employees?${newParams.toString()}`);
    }
  }, [searchParams, router]);
  const [data, setData] = useState<{
    data: EmployeeListItem[];
    pagination: PaginationInfo;
  } | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [jobPositions, setJobPositions] = useState<any[]>([]);
  const [deptFilter, setDeptFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    apiRequest("GET", "/departments").then((res) =>
      setDepartments(res.data || []),
    );
    apiRequest("GET", "/job-positions").then((res) =>
      setJobPositions(res.data || []),
    );
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    if (statusFilter === "inactive") params.set("inactive", "1");
    if (deptFilter !== "all" && deptFilter)
      params.set("department_id", deptFilter);
    if (jobFilter !== "all" && jobFilter)
      params.set("job_position_id", jobFilter);

    apiRequest("GET", `/employees?${params.toString()}`)
      .then(setData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, page, statusFilter, deptFilter, jobFilter]);

  const handleArchive = async (id: string) => {
    setDeleting(id);
    const promise = apiRequest("DELETE", `/employees/${id}`);

    toast.promise(promise, {
      loading: "Archiving employee...",
      success: (data) => {
        setData((prev) =>
          prev
            ? { ...prev, data: prev.data.filter((e) => e._id !== id) }
            : prev,
        );
        return "Employee archived successfully";
      },
      error: (err) => err.message || "Failed to archive employee",
      finally: () => setDeleting(null),
    });
  };

  const totalEmployees = data?.pagination?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground">
            Manage your workforce — {totalEmployees} employee
            {totalEmployees !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => fetchEmployees()}
            disabled={loading}
            title="Refresh"
          >
            <RotateCw className={cn("size-4", loading && "animate-spin")} />
          </Button>
          <CreateEmployeeDialog 
            open={isCreateOpen} 
            onOpenChange={setIsCreateOpen} 
            onSuccess={() => fetchEmployees()} 
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, badge..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="h-10 pl-10"
          />
        </div>
        <Select
          value={deptFilter}
          onValueChange={(v) => {
            setDeptFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-10 w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((d) => (
              <SelectItem key={d._id} value={d._id}>
                {d.department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={jobFilter}
          onValueChange={(v) => {
            setJobFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-10 w-[180px]">
            <SelectValue placeholder="Job Position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Positions</SelectItem>
            {jobPositions.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.job_position}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-10 w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Employee</TableHead>
                <TableHead className="font-semibold">Email</TableHead>
                <TableHead className="font-semibold">Badge ID</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-12 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-[80px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto inline-block" />
                    </TableCell>
                  </TableRow>
                ))
              ) : data?.data?.length ? (
                data.data.map((emp) => {
                  const initials = getInitials(
                    emp.employee_first_name,
                    emp.employee_last_name,
                  );
                  const fullName =
                    `${emp.employee_first_name} ${emp.employee_last_name || ""}`.trim();
                  const avatarColor = getAvatarColor(fullName);
                  const isActive = emp.is_active !== false;

                  return (
                    <TableRow
                      key={emp._id}
                      className="group hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <Link
                          href={`/employees/${emp._id}`}
                          className="flex items-center gap-3"
                        >
                          <div
                            className={cn(
                              "flex size-10 items-center justify-center rounded-full text-white text-xs font-bold shadow-sm",
                              avatarColor,
                            )}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground hover:text-primary transition-colors">
                              {fullName}
                            </p>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Mail className="size-3.5 shrink-0" />
                          <span className="truncate text-sm">{emp.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {emp.badge_id ? (
                          <div className="flex items-center gap-1.5">
                            <BadgeCheck className="size-3.5 text-primary shrink-0" />
                            <span className="text-sm font-medium">
                              {emp.badge_id}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {emp.phone || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "text-[10px] font-medium",
                            isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
                          )}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            asChild
                          >
                            <Link href={`/employees/${emp._id}`} title="View">
                              <Eye className="size-4 text-muted-foreground" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            asChild
                          >
                            <Link
                              href={`/employees/${emp._id}/edit`}
                              title="Edit"
                            >
                              <Pencil className="size-4 text-muted-foreground" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => handleArchive(emp._id)}
                            disabled={deleting === emp._id}
                            title="Archive"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <Users className="size-7 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        No employees found
                      </p>
                      <Button onClick={() => setIsCreateOpen(true)} size="sm" variant="outline">
                        Create your first employee
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.pages} ·{" "}
            {data.pagination.total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="gap-1"
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.pagination.pages}
              onClick={() => setPage((p) => p + 1)}
              className="gap-1"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
