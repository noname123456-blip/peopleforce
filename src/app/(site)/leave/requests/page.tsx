"use client";

import React, { useState } from "react";
import { useList } from "@/hooks/use-list";
import { useUpdate } from "@/hooks/use-update";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/utils/formatters";
import { formatStatus } from "@/utils/formatters";
import { notify } from "@/utils/notifications";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { canManageLeave } from "@/lib/rbac";
import { useRequireRole } from "@/hooks/use-require-role";

interface LeaveRequest {
  _id: string;
  employee_id?:
    | { employee_first_name: string; employee_last_name: string }
    | string;
  leave_type_id?: { leave_type_name: string } | string;
  start_date: string;
  end_date: string;
  status: "requested" | "approved" | "rejected" | "cancelled";
  requested_days?: number;
  description?: string;
  createdAt?: string;
}

export default function LeaveRequestsPage() {
  const { user } = useAuth();
  useRequireRole(canManageLeave);

  const [approvalDialog, setApprovalDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null,
  );
  const [approvalStatus, setApprovalStatus] = useState<"approved" | "rejected">(
    "approved",
  );
  const [rejectionReason, setRejectionReason] = useState("");

  const {
    data: leaveRequests,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    goToPage,
    refetch,
  } = useList<LeaveRequest>("/leave/requests", { defaultLimit: 10 });

  const { update: updateRequest, loading: updating } =
    useUpdate("/leave/requests");

  const getEmployeeName = (emp: any) => {
    if (typeof emp === "string") return emp;
    return (
      `${emp?.employee_first_name || ""} ${emp?.employee_last_name || ""}`.trim() ||
      "Unknown"
    );
  };

  const getLeaveType = (leaveType: any) => {
    return typeof leaveType === "string"
      ? leaveType
      : leaveType?.leave_type_name || "Unknown";
  };

  const handleApproveClick = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setApprovalStatus("approved");
    setRejectionReason("");
    setApprovalDialog(true);
  };

  const handleRejectClick = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setApprovalStatus("rejected");
    setRejectionReason("");
    setApprovalDialog(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedRequest) return;

    if (approvalStatus === "rejected" && !rejectionReason) {
      notify.warning("Please provide a rejection reason");
      return;
    }

    const updateData = {
      status: approvalStatus,
      ...(approvalStatus === "rejected" && {
        rejection_reason: rejectionReason,
      }),
    };

    const result = await updateRequest(selectedRequest._id, updateData, {
      showNotification: true,
      successMessage: `Leave request ${approvalStatus} successfully`,
    });

    if (result) {
      setApprovalDialog(false);
      setSelectedRequest(null);
      refetch();
    }
  };

  const columns: DataTableColumn<LeaveRequest>[] = [
    {
      key: "employee_id",
      label: "Employee",
      render: (value) => getEmployeeName(value),
    },
    {
      key: "leave_type_id",
      label: "Leave Type",
      render: (value) => getLeaveType(value),
    },
    {
      key: "start_date",
      label: "From",
      sortable: true,
      render: (value) => formatDate(value, "MMM dd, yyyy"),
    },
    {
      key: "end_date",
      label: "To",
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
      label: "Approve",
      icon: <CheckCircle2 className="h-4 w-4" />,
      onClick: handleApproveClick,
      show: (request) => request.status === "requested",
    },
    {
      label: "Reject",
      icon: <XCircle className="h-4 w-4" />,
      variant: "destructive",
      onClick: handleRejectClick,
      show: (request) => request.status === "requested",
    },
  ];

  // Status counts (calculated from current data)
  const statusCounts = {
    pending: leaveRequests.filter((r) => r.status === "requested").length,
    approved: leaveRequests.filter((r) => r.status === "approved").length,
    rejected: leaveRequests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
        <p className="text-muted-foreground">
          Manage and approve employee leave requests
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
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
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{statusCounts.rejected}</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              updateFilters({ status: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="requested">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
          <CardDescription>
            Review and manage all employee leave requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable<LeaveRequest>
            columns={columns}
            data={leaveRequests}
            loading={loading}
            error={error}
            actions={actions}
            pagination={pagination}
            onPageChange={goToPage}
            showPagination={true}
            showSearch={false}
            emptyMessage="No leave requests to review"
          />
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={approvalDialog} onOpenChange={setApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalStatus === "approved" ? "Approve Leave" : "Reject Leave"}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest &&
                `Employee: ${getEmployeeName(selectedRequest.employee_id)}`}
            </DialogDescription>
          </DialogHeader>

          {approvalStatus === "rejected" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rejection Reason</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection..."
                  className="w-full h-20 mt-2 p-2 border rounded-lg"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmApproval}
              disabled={updating}
              variant={
                approvalStatus === "approved" ? "default" : "destructive"
              }
            >
              {updating
                ? "Processing..."
                : approvalStatus === "approved"
                  ? "Approve"
                  : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
