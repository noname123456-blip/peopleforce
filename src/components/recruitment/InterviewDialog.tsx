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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreate } from "@/hooks/use-create";
import { useUpdate } from "@/hooks/use-update";
import { useList } from "@/hooks/use-list";

interface InterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  interview?: any;
}

export function InterviewDialog({
  open,
  onOpenChange,
  onSuccess,
  interview,
}: InterviewDialogProps) {
  const { create, loading: creating } = useCreate("/interviews");
  const { update, loading: updating } = useUpdate("/interviews");

  const { data: candidates = [], loading: loadingCandidates } =
    useList<any>("/candidates");
  const { data: employees = [], loading: loadingEmployees } =
    useList<any>("/employees");

  const [formData, setFormData] = useState({
    candidate_id: "",
    employee_id: [] as string[],
    interview_date: "",
    interview_time: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    if (interview) {
      setFormData({
        candidate_id:
          interview.candidate_id?._id || interview.candidate_id || "",
        employee_id: interview.employee_id?.map((e: any) => e._id || e) || [],
        interview_date: interview.interview_date
          ? new Date(interview.interview_date).toISOString().split("T")[0]
          : "",
        interview_time: interview.interview_time || "",
        description: interview.description || "",
        completed: interview.completed || false,
      });
    } else {
      setFormData({
        candidate_id: "",
        employee_id: [],
        interview_date: "",
        interview_time: "",
        description: "",
        completed: false,
      });
    }
  }, [interview, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let result = null;
    if (interview) {
      result = await update(interview._id, formData, {
        successMessage: "Interview updated successfully",
      });
    } else {
      result = await create(formData, {
        successMessage: "Interview scheduled",
      });
    }

    if (result) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const loading = creating || updating;

  // Simple multi-select handler for employees
  const toggleEmployee = (empId: string) => {
    setFormData((prev) => {
      const isSelected = prev.employee_id.includes(empId);
      if (isSelected) {
        return {
          ...prev,
          employee_id: prev.employee_id.filter((id) => id !== empId),
        };
      }
      return { ...prev, employee_id: [...prev.employee_id, empId] };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {interview ? "Edit Interview" : "Schedule Interview"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label>Candidate *</Label>
            <Select
              value={formData.candidate_id || undefined}
              onValueChange={(val) =>
                setFormData({ ...formData, candidate_id: val })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select candidate" />
              </SelectTrigger>
              <SelectContent>
                {loadingCandidates ? (
                  <div className="p-2 space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : candidates.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No candidates found
                  </SelectItem>
                ) : (
                  candidates.map((c: any) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.interview_date}
                onChange={(e) =>
                  setFormData({ ...formData, interview_date: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Time *</Label>
              <Input
                type="time"
                value={formData.interview_time}
                onChange={(e) =>
                  setFormData({ ...formData, interview_time: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Interviewers (Select multiple)</Label>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto border border-white/10 p-2 rounded-xl bg-white/5">
              {loadingEmployees ? (
                <div className="space-y-2 p-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : employees.length === 0 ? (
                <span className="text-xs text-muted-foreground p-1">
                  No employees found
                </span>
              ) : (
                employees.map((emp: any) => (
                  <Label
                    key={emp._id}
                    className="flex items-center gap-2 font-normal cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-white/10 bg-white/5"
                      checked={formData.employee_id.includes(emp._id)}
                      onChange={() => toggleEmployee(emp._id)}
                    />
                    {emp.employee_first_name} {emp.employee_last_name}
                  </Label>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.completed}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, completed: checked })
              }
            />
            <Label>Mark as Completed</Label>
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
              {loading ? "Saving..." : interview ? "Update" : "Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
