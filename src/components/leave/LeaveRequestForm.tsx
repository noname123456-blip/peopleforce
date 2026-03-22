"use client";

import React, { useState } from "react";
import { useCreate } from "@/hooks/use-create";
import { useList } from "@/hooks/use-list";
import { Button } from "@/components/ui/button";
import {
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
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

interface LeaveRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function LeaveRequestForm({ onSuccess, onCancel }: LeaveRequestFormProps) {
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

    if (!form.description || form.description.trim().length === 0) {
      errors.description = "Reason for leave is required";
    }

    if (form.end_date && !validateDateRange(form.start_date, form.end_date)) {
      errors.end_date = "End date must be after or equal to start date";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateDays = () => {
    const start = new Date(form.start_date);
    const end = form.end_date ? new Date(form.end_date) : start;
    
    // Simple diff for now
    let days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    // Adjust for breakdown (very basic logic)
    if (form.start_date_breakdown !== "full_day") days -= 0.5;
    if (form.end_date && form.end_date_breakdown !== "full_day") days -= 0.5;
    
    return Math.max(0.5, days);
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
      requested_days: calculateDays(),
    };

    const result = await create(submitData, {
      showNotification: true,
      successMessage: "Leave request submitted successfully!",
    });

    if (result && onSuccess) {
      onSuccess();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
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
            placeholder="Select leave type"
          />

          <div className="flex items-end pb-2">
            {selectedLeaveType && (
              <Badge variant="outline" className="h-fit">
                Allocated: {selectedLeaveType.available_days || 0} days
              </Badge>
            )}
          </div>

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
            label="From Breakdown"
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
            label="To Breakdown"
            value={form.end_date_breakdown}
            onValueChange={(value) =>
              setForm({ ...form, end_date_breakdown: value as any })
            }
            options={breakdownOptions}
          />
        </FormGrid>

        <FormTextarea
          label="Reason"
          value={form.description}
          onChange={(e) => {
            setForm({ ...form, description: e.target.value });
            if (formErrors.description) {
              setFormErrors({ ...formErrors, description: "" });
            }
          }}
          placeholder="Please provide a brief reason for your leave..."
          rows={3}
          hint="This will help managers understand your leave request"
          error={formErrors.description}
          required
        />
      </div>

      <FormActions align="right" className="pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </FormActions>
    </form>
  );
}
