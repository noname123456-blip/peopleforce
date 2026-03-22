"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import RequestLeaveDialog from "@/components/leave/RequestLeaveDialog";
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
import { Progress } from "@/components/ui/progress";
import { formatDate, formatStatus } from "@/utils/formatters";
import { notify } from "@/utils/notifications";
import {
  Plus,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaveRequest {
  _id: string;
  leave_type_id?: { name: string } | string;
  start_date: string;
  end_date: string;
  start_date_breakdown?: string;
  end_date_breakdown?: string;
  description?: string;
  status: "requested" | "approved" | "rejected" | "cancelled";
  requested_days?: number;
  approved_days?: number;
  createdAt?: string;
}

interface LeaveBalance {
  _id: string;
  leave_type_id?: { name: string } | string;
  available_days: number;
  used_days?: number;
  requests_pending?: number;
}

export default function MyLeavePage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("request") === "true") {
      setIsRequestOpen(true);
      // Optional: clear param
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("request");
      router.replace(`/leave/my?${newParams.toString()}`);
    }
  }, [searchParams, router]);

  // Fetch leave requests
  const {
    data: leaveRequests,
    loading: requestsLoading,
    error: requestsError,
    pagination,
    goToPage,
    refetch,
  } = useList<LeaveRequest>("/leave/requests", { defaultLimit: 10 });

  // Fetch leave balance
  const { data: leaveBalance } = useList<LeaveBalance>("/leave/availability", {
    defaultLimit: 100,
  });

  const { delete: deleteRequest, loading: deleteLoading } =
    useDelete("/leave/requests");

  const getLeaveTypeName = (leaveType: any) => {
    return typeof leaveType === "string"
      ? leaveType
      : leaveType?.name || "Unknown";
  };

  const handleDeleteClick = (request: LeaveRequest) => {
    // Only allow deleting pending requests
    if (request.status !== "requested") {
      notify.warning("Only pending requests can be deleted");
      return;
    }
    setSelectedRequest(request);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRequest) return;

    const success = await deleteRequest(selectedRequest._id, {
      successMessage: "Leave request cancelled successfully",
    });

    if (success) {
      setDeleteDialogOpen(false);
      setSelectedRequest(null);
      refetch();
    }
  };

  const columns: DataTableColumn<LeaveRequest>[] = [
    {
      key: "leave_type_id",
      label: "Leave Type",
      render: (value) => getLeaveTypeName(value),
    },
    {
      key: "start_date",
      label: "From Date",
      sortable: true,
      render: (value) => formatDate(value, "MMM dd, yyyy"),
    },
    {
      key: "end_date",
      label: "To Date",
      sortable: true,
      render: (value) => formatDate(value, "MMM dd, yyyy"),
    },
    {
      key: "requested_days",
      label: "Days",
      render: (value) => `${value || 0} days`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const statusInfo = formatStatus(value);
        return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>;
      },
    },
  ];

  const actions: DataTableAction<LeaveRequest>[] = [
    {
      label: "Cancel",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive",
      onClick: handleDeleteClick,
      show: (request) => request.status === "requested",
    },
  ];

  // Status distribution
  const statusCounts = {
    pending: (leaveRequests || []).filter((r) => r.status === "requested")
      .length,
    approved: (leaveRequests || []).filter((r) => r.status === "approved")
      .length,
    rejected: (leaveRequests || []).filter((r) => r.status === "rejected")
      .length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Leave</h1>
          <p className="text-muted-foreground">
            Manage your leave requests and check balance
          </p>
        </div>
        <RequestLeaveDialog 
          open={isRequestOpen} 
          onOpenChange={setIsRequestOpen} 
          onSuccess={() => refetch()} 
        />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{statusCounts.pending}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{statusCounts.approved}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/50">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{statusCounts.rejected}</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{leaveRequests.length}</p>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Balance Section */}
      {leaveBalance && leaveBalance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
            <CardDescription>Your available leave by type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaveBalance.map((balance) => {
              const usedDays = balance.used_days || 0;
              const totalDays = balance.available_days;
              const usagePercent =
                totalDays > 0 ? (usedDays / totalDays) * 100 : 0;

              return (
                <div key={balance._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {typeof balance.leave_type_id === "string"
                        ? balance.leave_type_id
                        : balance.leave_type_id?.name || "Unknown"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {usedDays} / {totalDays} days
                    </span>
                  </div>
                  <Progress value={usagePercent} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Leave Requests</CardTitle>
          <CardDescription>Your submitted leave requests</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable<LeaveRequest>
            columns={columns}
            data={leaveRequests}
            loading={requestsLoading}
            error={requestsError}
            actions={actions}
            pagination={pagination}
            onPageChange={goToPage}
            showPagination={true}
            showSearch={false}
            emptyMessage="No leave requests. Request your first leave!"
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        itemName={
          selectedRequest
            ? `leave request from ${formatDate(selectedRequest.start_date)} to ${formatDate(selectedRequest.end_date)}`
            : undefined
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedRequest(null);
        }}
        isLoading={deleteLoading}
      />
    </div>
  );
}
