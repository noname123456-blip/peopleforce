"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, DataTableColumn, DataTableAction } from "@/components/DataTable";
import { DeleteConfirmDialog } from "@/components/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/utils/formatters";
import { Plus, Edit, Trash2, Clock, CheckCircle2, Calendar, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceRecord {
  _id: string;
  employee_id?: string;
  attendance_date: string;
  attendance_clock_in: string;
  attendance_clock_out: string;
  attendance_overtime?: number;
  is_valid?: boolean;
  work_type_id?: string;
}

export default function MyAttendancePage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const {
    data,
    loading,
    error,
    pagination,
    search,
    setSearch,
    goToPage,
    refetch,
  } = useList<AttendanceRecord>("/attendance", {
    defaultLimit: 10,
  });

  const { delete: deleteAttendance, loading: deleteLoading } = useDelete("/attendance");

  const handleDeleteClick = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRecord) return;

    const success = await deleteAttendance(selectedRecord._id, {
      successMessage: "Attendance record deleted successfully",
    });

    if (success) {
      setDeleteDialogOpen(false);
      setSelectedRecord(null);
      refetch();
    }
  };

  const columns: DataTableColumn<AttendanceRecord>[] = [
    {
      key: "attendance_date",
      label: "Date",
      sortable: true,
      render: (value) => formatDate(value, "MMM dd, yyyy"),
    },
    {
      key: "attendance_clock_in",
      label: "Clock In",
      render: (value) => formatTime(value, "HH:mm"),
    },
    {
      key: "attendance_clock_out",
      label: "Clock Out",
      render: (value) => formatTime(value, "HH:mm"),
    },
    {
      key: "work_type_id",
      label: "Work Type",
      render: (value) => {
        const types: Record<string, string> = {
          on_site: "On Site",
          remote: "Remote",
          hybrid: "Hybrid",
        };
        return types[value] || value || "N/A";
      },
    },
    {
      key: "is_valid",
      label: "Status",
      render: (value) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Validated" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "attendance_overtime",
      label: "Overtime (hrs)",
      render: (value) => (value ? `${value.toFixed(2)}` : "0"),
    },
  ];

  const actions: DataTableAction<AttendanceRecord>[] = [
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive",
      onClick: handleDeleteClick,
    },
  ];

  // Calculate stats
  const totalPresent = data.length;
  const totalOvertime = data.reduce((sum, r) => sum + (r.attendance_overtime || 0), 0);
  const pendingValidation = data.filter((r) => !r.is_valid).length;
  const avgHours = totalPresent > 0 ? (8 * totalPresent) / totalPresent : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
          <p className="text-muted-foreground">
            View and manage your attendance records
          </p>
        </div>
        <Button onClick={() => router.push("/attendance/mark")}>
          <Plus className="mr-2 h-4 w-4" />
          Mark Attendance
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{totalPresent}</p>
              <p className="text-xs text-muted-foreground">Days Present</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/50">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{totalOvertime.toFixed(1)}h</p>
              <p className="text-xs text-muted-foreground">Total Overtime</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{pendingValidation}</p>
              <p className="text-xs text-muted-foreground">Pending Validation</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/50">
              <Timer className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{avgHours.toFixed(1)}h</p>
              <p className="text-xs text-muted-foreground">Avg Hours/Day</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Your complete attendance history</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable<AttendanceRecord>
            columns={columns}
            data={data}
            loading={loading}
            error={error}
            actions={actions}
            pagination={pagination}
            onPageChange={goToPage}
            showPagination={true}
            showSearch={true}
            searchPlaceholder="Search by date..."
            emptyMessage="No attendance records yet. Mark your first attendance!"
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        itemName={
          selectedRecord
            ? `attendance record on ${formatDate(selectedRecord.attendance_date)}`
            : undefined
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedRecord(null);
        }}
        isLoading={deleteLoading}
      />
    </div>
  );
}
