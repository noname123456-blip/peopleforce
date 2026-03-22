"use client";

import React, { useState, useEffect } from "react";
import { useCreate } from "@/hooks/use-create";
import { useList } from "@/hooks/use-list";
import { Button } from "@/components/ui/button";
import {
  FormGrid,
  FormActions,
} from "@/components/forms/FormSection";
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/forms/FormField";
import { notify } from "@/utils/notifications";
import { Card, CardContent } from "@/components/ui/card";

interface AssetCategory {
  _id: string;
  asset_category_name: string;
}

interface CreateAssetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateAssetForm({ onSuccess, onCancel }: CreateAssetFormProps) {
  const { create, loading, error } = useCreate("/api/assets");
  const { data: categories } = useList<AssetCategory>("/api/assets/categories", {
    defaultLimit: 100,
  });

  const [form, setForm] = useState({
    asset_name: "",
    asset_description: "",
    asset_tracking_id: "",
    asset_purchase_cost: 0,
    asset_category_id: "",
    asset_status: "Available",
    asset_purchase_date: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!form.asset_name) errors.asset_name = "Asset name is required";
    if (!form.asset_category_id) errors.asset_category_id = "Category is required";
    if (!form.asset_tracking_id) errors.asset_tracking_id = "Tracking ID is required";

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
      successMessage: "Asset created successfully!",
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
        <FormGrid>
          <FormInput
            label="Asset Name"
            value={form.asset_name}
            onChange={(e) => {
              setForm({ ...form, asset_name: e.target.value });
              if (formErrors.asset_name) {
                setFormErrors({ ...formErrors, asset_name: "" });
              }
            }}
            error={formErrors.asset_name}
            required
            placeholder="e.g. MacBook Pro"
          />
          <FormSelect
            label="Category"
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

        <FormGrid>
          <FormInput
            label="Tracking ID"
            value={form.asset_tracking_id}
            onChange={(e) => {
              setForm({ ...form, asset_tracking_id: e.target.value });
              if (formErrors.asset_tracking_id) {
                setFormErrors({ ...formErrors, asset_tracking_id: "" });
              }
            }}
            error={formErrors.asset_tracking_id}
            required
            placeholder="e.g. AST-001"
          />
          <FormInput
            label="Purchase Cost"
            type="number"
            value={form.asset_purchase_cost}
            onChange={(e) =>
              setForm({
                ...form,
                asset_purchase_cost: Number(e.target.value),
              })
            }
          />
        </FormGrid>

        <FormGrid>
          <FormSelect
            label="Status"
            value={form.asset_status}
            onValueChange={(value) => setForm({ ...form, asset_status: value })}
            options={[
              { value: "Available", label: "Available" },
              { value: "In use", label: "In Use" },
              { value: "Not-Available", label: "Not Available" },
            ]}
          />
          <FormInput
            label="Purchase Date"
            type="date"
            value={form.asset_purchase_date}
            onChange={(e) =>
              setForm({ ...form, asset_purchase_date: e.target.value })
            }
          />
        </FormGrid>

        <FormTextarea
          label="Description"
          value={form.asset_description}
          onChange={(e) =>
            setForm({ ...form, asset_description: e.target.value })
          }
          placeholder="Detailed description of the asset..."
          rows={3}
        />
      </div>

      <FormActions align="right" className="pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Asset"}
        </Button>
      </FormActions>
    </form>
  );
}
