"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { Loader } from "@/components/ui/loader";
import { InterviewDialog } from "@/components/recruitment/InterviewDialog";

const statusConfig: Record<
  string,
  {
    icon: typeof CheckCircle2;
    color: string;
    bg: string;
    matchLogic: (i: any) => boolean;
  }
> = {
  "Interview Completed": {
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    matchLogic: (i) => i.completed === true,
  },
  Scheduled: {
    icon: Clock,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/50",
    matchLogic: (i) =>
      i.completed !== true &&
      new Date(i.interview_date) >= new Date(new Date().setHours(0, 0, 0, 0)),
  },
  "Expired Interview": {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/50",
    matchLogic: (i) =>
      i.completed !== true &&
      new Date(i.interview_date) < new Date(new Date().setHours(0, 0, 0, 0)),
  },
};

const getStatus = (interview: any) => {
  for (const [status, config] of Object.entries(statusConfig)) {
    if (config.matchLogic(interview)) return status;
  }
  return "Scheduled";
};

export default function InterviewsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<any>(null);

  const {
    data: interviews = [],
    loading,
    refetch,
  } = useList<any>("/interviews");
  const { delete: deleteInterview } = useDelete("/interviews");

  const filtered = interviews.filter((i: any) => {
    const candidateName = i.candidate_id?.name || "";
    const matchesSearch = candidateName
      .toLowerCase()
      .includes(search.toLowerCase());
    const status = getStatus(i);
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const statusCounts = interviews.reduce(
    (acc: Record<string, number>, i: any) => {
      const status = getStatus(i);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this interview schedule?")) {
      const success = await deleteInterview(id);
      if (success) refetch();
    }
  };

  const handleEdit = (interview: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingInterview(interview);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Scheduled Interviews
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and track all scheduled interviews
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search candidate..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-[200px] pl-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="size-3.5" />
            Filter
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => {
              setEditingInterview(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="size-3.5" />
            Create
          </Button>
        </div>
      </div>

      {/* Status summary cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon;
          const count = statusCounts[status] || 0;
          return (
            <button
              key={status}
              onClick={() =>
                setStatusFilter(statusFilter === status ? "all" : status)
              }
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                statusFilter === status
                  ? "border-primary/30 bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:bg-accent/50",
              )}
            >
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg",
                  config.bg,
                )}
              >
                <Icon className={cn("size-5", config.color)} />
              </div>
              <div>
                <p className="text-xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{status}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Interviewers</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    Date
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    Time
                  </div>
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12">
                    <div className="flex justify-center">
                      <Loader />
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground border-2 border-dashed border-border/50 rounded-xl"
                  >
                    No interviews found
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((interview: any) => {
                  const status = getStatus(interview);
                  const config = statusConfig[status];
                  const Icon = config?.icon || Clock;
                  const cName = interview.candidate_id?.name || "Unknown";
                  const cInitials = cName
                    .split(" ")
                    .map((w: string) => w[0])
                    .join("")
                    .slice(0, 2);
                  const intDate = new Date(
                    interview.interview_date,
                  ).toLocaleDateString();

                  return (
                    <TableRow
                      key={interview._id}
                      className="group cursor-pointer"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                            {cInitials}
                          </div>
                          <span className="font-medium">{cName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {interview.employee_id?.length || 0} Interviewer
                        {(interview.employee_id?.length || 0) !== 1 ? "s" : ""}
                      </TableCell>
                      <TableCell className="font-medium">{intDate}</TableCell>
                      <TableCell>{interview.interview_time}</TableCell>
                      <TableCell className="max-w-[150px] truncate text-muted-foreground">
                        {interview.description || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "gap-1 text-[10px] font-medium",
                            config?.bg,
                            config?.color,
                          )}
                          variant="outline"
                        >
                          <Icon className="size-3" />
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={(e) => handleEdit(interview, e)}
                          >
                            <Edit2 className="size-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7"
                            onClick={(e) => handleDelete(interview._id, e)}
                          >
                            <Trash2 className="size-3.5 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * perPage + 1}&ndash;
            {Math.min(currentPage * perPage, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <InterviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        interview={editingInterview}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
