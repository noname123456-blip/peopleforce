"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreate } from "@/hooks/use-create";
import { useList } from "@/hooks/use-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FormSection,
  FormGrid,
  FormActions,
} from "@/components/forms/FormSection";
import {
  FormDateInput,
  FormSelect,
  FormTextarea,
} from "@/components/forms/FormField";
import { Badge } from "@/components/ui/badge";
import { notify } from "@/utils/notifications";
import { validateDateRange } from "@/utils/validation";
import { ArrowLeft, Calendar } from "lucide-react";

interface LeaveType {
  _id: string;
  name: string;
  available_days?: number;
}

interface LeaveRequest {
  leave_type_id: string;
  start_date: string;
  start_date_breakdown: "full_day" | "first_half" | "second_half";
  end_date: string;
  end_date_breakdown: "full_day" | "first_half" | "second_half";
  description: string;
}

export default function RequestLeavePage() {
  const router = useRouter();
  const { create, loading, error } = useCreate("/leave/requests");
  const { data: leaveTypes } = useList<LeaveType>("/leave/types", {
    defaultLimit: 100,
  });

  const [form, setForm] = useState<LeaveRequest>({
    leave_type_id: "",
    start_date: "",
    start_date_breakdown: "full_day",
    end_date: "",
    end_date_breakdown: "full_day",
    description: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.leave_type_id) {
      errors.leave_type_id = "Leave type is required";
    }

    if (!form.start_date) {
      errors.start_date = "Start date is required";
    }

    if (form.end_date && !validateDateRange(form.start_date, form.end_date)) {
      errors.end_date = "End date must be after or equal to start date";
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

    const submitData = {
      ...form,
      end_date: form.end_date || form.start_date,
    };

    const result = await create(submitData, {
      showNotification: true,
      successMessage: "Leave request submitted successfully!",
    });

    if (result) {
      router.push("/leave/my");
    }
  };

  const selectedLeaveType = leaveTypes?.find(
    (lt) => lt._id === form.leave_type_id,
  );
  const breakdownOptions = [
    { value: "full_day", label: "Full Day" },
    { value: "first_half", label: "First Half" },
    { value: "second_half", label: "Second Half" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/leave/my">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Request Leave</h1>
          <p className="text-muted-foreground">Submit a new leave request</p>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 mb-6">
            <CardContent className="pt-6">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Leave Details Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Leave Details
            </CardTitle>
            <CardDescription>Select leave type and dates</CardDescription>
          </CardHeader>
          <CardContent>
            <FormGrid cols={2}>
              <FormSelect
                label="Leave Type"
                value={form.leave_type_id}
                onValueChange={(value) => {
                  setForm({ ...form, leave_type_id: value });
                  if (formErrors.leave_type_id) {
                    setFormErrors({ ...formErrors, leave_type_id: "" });
                  }
                }}
                options={
                  leaveTypes?.map((lt) => ({
                    value: lt._id,
                    label: lt.name,
                  })) || []
                }
                error={formErrors.leave_type_id}
                required
              />

              {selectedLeaveType && (
                <div className="flex items-end">
                  <Badge variant="outline" className="h-fit">
                    Allocated: {selectedLeaveType.available_days || 0} days
                  </Badge>
                </div>
              )}

              <FormDateInput
                label="From Date"
                value={form.start_date}
                onChange={(e) => {
                  setForm({ ...form, start_date: e.target.value });
                  if (formErrors.start_date) {
                    setFormErrors({ ...formErrors, start_date: "" });
                  }
                }}
                error={formErrors.start_date}
                required
              />

              <FormSelect
                label="From (Breakdown)"
                value={form.start_date_breakdown}
                onValueChange={(value) =>
                  setForm({ ...form, start_date_breakdown: value as any })
                }
                options={breakdownOptions}
                required
              />

              <FormDateInput
                label="To Date (Optional)"
                value={form.end_date}
                onChange={(e) => {
                  setForm({ ...form, end_date: e.target.value });
                  if (formErrors.end_date) {
                    setFormErrors({ ...formErrors, end_date: "" });
                  }
                }}
                error={formErrors.end_date}
              />

              <FormSelect
                label="To (Breakdown)"
                value={form.end_date_breakdown}
                onValueChange={(value) =>
                  setForm({ ...form, end_date_breakdown: value as any })
                }
                options={breakdownOptions}
              />
            </FormGrid>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Provide reason for your leave (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormTextarea
              label="Reason"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Please provide a brief reason for your leave..."
              rows={4}
              hint="This will help managers understand your leave request"
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <FormActions align="right">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </FormActions>
      </form>
    </div>
  );
}
