"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreate } from "@/hooks/use-create";
import { useAuth } from "@/contexts/auth-context";
import { canManageAttendance } from "@/lib/rbac";
import { useRequireRole } from "@/hooks/use-require-role";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FormSection,
  FormGrid,
  FormActions,
} from "@/components/forms/FormSection";
import {
  FormDateInput,
  FormTimeInput,
  FormSelect,
} from "@/components/forms/FormField";
import { notify } from "@/utils/notifications";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MarkAttendancePage() {
  const router = useRouter();
  const { user } = useAuth();
  // Regular employees should be able to mark their own attendance
  // useRequireRole(canManageAttendance);

  const { create, loading, error } = useCreate("/attendance");

  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    attendance_date: today,
    attendance_clock_in: "09:00",
    attendance_clock_out: "17:00",
    work_type_id: "on_site",
    employee_id: "",
  });

  React.useEffect(() => {
    if (user?.email) {
      fetch(`/api/employees?search=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((res) => {
          const emp = res.data?.[0];
          if (emp) {
            setFormData((prev) => ({ ...prev, employee_id: emp._id }));
          }
        });
    }
  }, [user]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.attendance_date) {
      errors.attendance_date = "Date is required";
    }

    if (!formData.attendance_clock_in) {
      errors.attendance_clock_in = "Clock-in time is required";
    }

    if (!formData.attendance_clock_out) {
      errors.attendance_clock_out = "Clock-out time is required";
    }

    if (formData.attendance_clock_in >= formData.attendance_clock_out) {
      errors.attendance_clock_out = "Clock-out must be after clock-in";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      notify.error("Please fix form errors");
      return;
    }

    if (!formData.employee_id) {
      notify.error("Could not resolve employee profile");
      return;
    }

    const result = await create(formData, {
      showNotification: true,
      successMessage: "Attendance marked successfully!",
    });

    if (result) {
      router.push("/attendance/my");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/attendance">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
          <p className="text-muted-foreground">
            Record your daily attendance with clock in/out times
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Details</CardTitle>
          <CardDescription>
            Enter your clock-in and clock-out times for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormGrid cols={2}>
              <FormDateInput
                label="Date"
                value={formData.attendance_date}
                onChange={(e) => {
                  setFormData({ ...formData, attendance_date: e.target.value });
                  if (formErrors.attendance_date) {
                    setFormErrors({ ...formErrors, attendance_date: "" });
                  }
                }}
                required
                error={formErrors.attendance_date}
              />

              <FormSelect
                label="Work Type"
                value={formData.work_type_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, work_type_id: value });
                }}
                options={[
                  { value: "on_site", label: "On Site" },
                  { value: "remote", label: "Remote" },
                  { value: "hybrid", label: "Hybrid" },
                ]}
                required
              />

              <FormTimeInput
                label="Clock In"
                value={formData.attendance_clock_in}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    attendance_clock_in: e.target.value,
                  });
                  if (formErrors.attendance_clock_in) {
                    setFormErrors({ ...formErrors, attendance_clock_in: "" });
                  }
                }}
                required
                error={formErrors.attendance_clock_in}
              />

              <FormTimeInput
                label="Clock Out"
                value={formData.attendance_clock_out}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    attendance_clock_out: e.target.value,
                  });
                  if (formErrors.attendance_clock_out) {
                    setFormErrors({ ...formErrors, attendance_clock_out: "" });
                  }
                }}
                required
                error={formErrors.attendance_clock_out}
              />
            </FormGrid>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <FormActions align="right">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Marking..." : "Mark Attendance"}
              </Button>
            </FormActions>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
