"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreate } from "@/hooks/use-create";
import { useUpdate } from "@/hooks/use-update";
import { useList } from "@/hooks/use-list";

interface StageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  stage?: any;
  recruitmentId: string | null;
}

const STAGE_TYPES = [
  "initial",
  "applied",
  "test",
  "interview",
  "cancelled",
  "hired",
];

export function StageDialog({
  open,
  onOpenChange,
  onSuccess,
  stage,
  recruitmentId,
}: StageDialogProps) {
  const { create, loading: creating } = useCreate("/stages");
  const { update, loading: updating } = useUpdate("/stages");
  const { data: employees = [] } = useList<any>("/employees");

  const [formData, setFormData] = useState({
    recruitment_id: "",
    stage: "",
    stage_type: "interview",
    sequence: 0,
    stage_managers: [] as string[],
  });

  useEffect(() => {
    if (stage) {
      setFormData({
        recruitment_id:
          stage.recruitment_id?._id ||
          stage.recruitment_id ||
          recruitmentId ||
          "",
        stage: stage.stage || "",
        stage_type: stage.stage_type || "interview",
        sequence: stage.sequence || 0,
        stage_managers: stage.stage_managers?.map((m: any) => m._id || m) || [],
      });
    } else {
      setFormData({
        recruitment_id: recruitmentId || "",
        stage: "",
        stage_type: "interview",
        sequence: 0,
        stage_managers: [],
      });
    }
  }, [stage, recruitmentId, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recruitment_id) return;

    let success = false;
    if (stage) {
      success = !!(await update(stage._id, formData, {
        successMessage: "Stage updated successfully",
      }));
    } else {
      success = !!(await create(formData, {
        successMessage: "Stage created successfully",
      }));
    }

    if (success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const toggleManager = (empId: string) => {
    setFormData((prev) => {
      const isSelected = prev.stage_managers.includes(empId);
      if (isSelected) {
        return {
          ...prev,
          stage_managers: prev.stage_managers.filter((id) => id !== empId),
        };
      }
      return { ...prev, stage_managers: [...prev.stage_managers, empId] };
    });
  };

  const loading = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{stage ? "Edit Stage" : "Add Stage"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label>Stage Name *</Label>
            <Input
              value={formData.stage}
              onChange={(e) =>
                setFormData({ ...formData, stage: e.target.value })
              }
              placeholder="e.g., Technical Interview"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Stage Type</Label>
              <Select
                value={formData.stage_type}
                onValueChange={(val) =>
                  setFormData({ ...formData, stage_type: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Sequence</Label>
              <Input
                type="number"
                value={formData.sequence}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sequence: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Stage Managers</Label>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border border-white/10 p-2 rounded-xl bg-white/5">
              {employees.map((emp: any) => (
                <Label
                  key={emp._id}
                  className="flex items-center gap-2 font-normal cursor-pointer text-sm"
                >
                  <input
                    type="checkbox"
                    className="rounded border-white/10 bg-white/5"
                    checked={formData.stage_managers.includes(emp._id)}
                    onChange={() => toggleManager(emp._id)}
                  />
                  {emp.employee_first_name} {emp.employee_last_name}
                </Label>
              ))}
              {employees.length === 0 && (
                <span className="text-xs text-muted-foreground p-1">
                  No employees found
                </span>
              )}
            </div>
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
              {loading ? "Saving..." : stage ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
