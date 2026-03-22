"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from "@/components/DataTable";
import { DeleteConfirmDialog } from "@/components/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";
import { Plus, Edit, Eye, Trash2, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useRequireRole } from "@/hooks/use-require-role";

interface JobOpening {
  _id: string;
  title: string;
  job_position_id?: { job_position: string } | string;
  vacancy?: number;
  description?: string;
  open_positions?: number;
  status?: "open" | "closed";
  closed?: boolean;
  is_published?: boolean;
  start_date?: string;
  end_date?: string;
}

export default function JobsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  const {
    data: jobs,
    loading,
    error,
    pagination,
    search,
    setSearch,
    goToPage,
    refetch,
  } = useList<JobOpening>("/recruitment", { defaultLimit: 10 });

  const { delete: deleteJob, loading: deleteLoading } =
    useDelete("/recruitment");

  const handleDeleteClick = (job: JobOpening) => {
    setSelectedJob(job);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedJob) return;

    const success = await deleteJob(selectedJob._id, {
      successMessage: "Job opening deleted successfully",
    });

    if (success) {
      setDeleteDialogOpen(false);
      setSelectedJob(null);
      refetch();
    }
  };

  const columns: DataTableColumn<JobOpening>[] = [
    {
      key: "title",
      label: "Job Title",
      sortable: true,
    },
    {
      key: "job_position_id",
      label: "Position",
      render: (value) =>
        typeof value === "string" ? value : value?.job_position || "N/A",
    },
    {
      key: "vacancy",
      label: "Vacancies",
      render: (value) => value || 0,
    },
    {
      key: "start_date",
      label: "Posted Date",
      sortable: true,
      render: (value) => (value ? formatDate(value, "MMM dd, yyyy") : "N/A"),
    },
    {
      key: "status",
      label: "Status",
      render: (_, item) => {
        if (item.closed) return <Badge variant="secondary">Closed</Badge>;
        if (item.is_published)
          return (
            <Badge
              variant="default"
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Published
            </Badge>
          );
        return <Badge variant="outline">Draft</Badge>;
      },
    },
  ];

  const actions: DataTableAction<JobOpening>[] = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (job) => router.push(`/recruitment/jobs/${job._id}`),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (job) => router.push(`/recruitment/jobs/${job._id}/edit`),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive",
      onClick: handleDeleteClick,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Job Openings</h1>
          <p className="text-muted-foreground">
            Manage job postings and recruitment
          </p>
        </div>
        <Button onClick={() => router.push("/recruitment/jobs/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Post a Job
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
              <Briefcase className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{jobs.length}</p>
              <p className="text-xs text-muted-foreground">Total Jobs</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
              <Briefcase className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {jobs.filter((j) => j.status === "open").length}
              </p>
              <p className="text-xs text-muted-foreground">Open Positions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50">
              <Briefcase className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xl font-bold">
                {jobs.reduce((sum, j) => sum + (j.vacancy || 0), 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Vacancies</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Job Openings</CardTitle>
          <CardDescription>Browse and manage all job postings</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable<JobOpening>
            columns={columns}
            data={jobs}
            loading={loading}
            error={error}
            actions={actions}
            pagination={pagination}
            onPageChange={goToPage}
            onSearch={setSearch}
            showPagination={true}
            showSearch={true}
            searchPlaceholder="Search jobs by title..."
            emptyMessage="No job openings yet. Post your first job!"
          />
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        itemName={selectedJob?.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedJob(null);
        }}
        isLoading={deleteLoading}
      />
    </div>
  );
}
