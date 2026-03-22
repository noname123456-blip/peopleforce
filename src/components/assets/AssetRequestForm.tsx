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
  FormSelect,
  FormTextarea,
} from "@/components/forms/FormField";
import { notify } from "@/utils/notifications";
import { Card, CardContent } from "@/components/ui/card";

interface AssetCategory {
  _id: string;
  asset_category_name: string;
}

interface AssetRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AssetRequestForm({ onSuccess, onCancel }: AssetRequestFormProps) {
  const { create, loading, error } = useCreate("/api/assets/requests");
  const { data: categories } = useList<AssetCategory>("/api/assets/categories", {
    defaultLimit: 100,
  });

  const [form, setForm] = useState({
    asset_category_id: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.asset_category_id) {
      errors.asset_category_id = "Category is required";
    }

    if (!form.description || form.description.trim().length === 0) {
      errors.description = "Reason for requesting as asset is required";
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

    const result = await create(form, {
      showNotification: true,
      successMessage: "Asset request submitted successfully!",
    });

    if (result && onSuccess) {
      onSuccess();
    }
  };

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
        <FormGrid cols={1}>
          <FormSelect
            label="Asset Category"
            value={form.asset_category_id}
            onValueChange={(value) => {
              setForm({ ...form, asset_category_id: value });
              if (formErrors.asset_category_id) {
                setFormErrors({ ...formErrors, asset_category_id: "" });
              }
            }}
            options={
              categories?.map((c) => ({
                value: c._id,
                label: c.asset_category_name,
              })) || []
            }
            error={formErrors.asset_category_id}
            required
            placeholder="Select a category"
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
          placeholder="Please explain why you need this asset..."
          rows={3}
          hint="Provide details about the required asset and its purpose"
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
