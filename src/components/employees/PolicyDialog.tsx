"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useCreate } from "@/hooks/use-create";
import { useUpdate } from "@/hooks/use-update";

interface PolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  policy?: any; // passing the full policy object
}

export function PolicyDialog({
  open,
  onOpenChange,
  onSuccess,
  policy,
}: PolicyDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: "Draft",
    description: "",
    content: "",
    version: "1.0",
  });

  const { create, loading: creating } = useCreate("/policies");
  const { update, loading: updating } = useUpdate("/policies");

  useEffect(() => {
    if (policy) {
      setFormData({
        title: policy.title || "",
        category: policy.category || "",
        status: policy.status || "Draft",
        description: policy.description || "",
        content: policy.content || "",
        version: policy.version || "1.0",
      });
    } else {
      setFormData({
        title: "",
        category: "",
        status: "Draft",
        description: "",
        content: "",
        version: "1.0",
      });
    }
  }, [policy, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let success = false;
    if (policy) {
      success = await update(policy._id, formData, {
        successMessage: "Policy updated successfully",
      });
    } else {
      success = await create(formData, {
        successMessage: "Policy created successfully",
      });
    }

    if (success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const loading = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{policy ? "Edit Policy" : "Add New Policy"}</DialogTitle>
          <DialogDescription>
            {policy
              ? "Update existing policy details."
              : "Create a new company policy or guideline."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="title">Policy Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Work From Home Policy"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Leave">Leave</SelectItem>
                  <SelectItem value="Conduct">Conduct</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief summary of the policy..."
              className="h-20"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Full Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Detailed policy content..."
              className="h-32"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {loading
                ? "Saving..."
                : policy
                  ? "Update Policy"
                  : "Create Policy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
