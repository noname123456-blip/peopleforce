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
import { Loader2 } from "lucide-react";

interface RestrictionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restriction: any;
  onSuccess: () => void;
}

export function RestrictionDialog({
  open,
  onOpenChange,
  restriction,
  onSuccess,
}: RestrictionDialogProps) {
  const isEditing = !!restriction?._id;
  const { create, loading: creating } = useCreate("/leave/restrictions");
  const { update, loading: updating } = useUpdate("/leave/restrictions");
  const loading = creating || updating;

  const { data: leaveTypes } = useList<any>("/leave/types");
  const { data: departments } = useList<any>("/departments");

  const [formData, setFormData] = useState<any>({
    title: "",
    leave_type_id: "all",
    start_date: "",
    end_date: "",
    department_id: "all",
    reason: "",
  });

  useEffect(() => {
    if (restriction) {
      setFormData({
        title: restriction.title || "",
        leave_type_id:
          restriction.leave_type_id?._id || restriction.leave_type_id || "all",
        start_date: restriction.start_date
          ? new Date(restriction.start_date).toISOString().split("T")[0]
          : "",
        end_date: restriction.end_date
          ? new Date(restriction.end_date).toISOString().split("T")[0]
          : "",
        department_id:
          restriction.department_id?._id || restriction.department_id || "all",
        reason: restriction.reason || "",
      });
    } else {
      setFormData({
        title: "",
        leave_type_id: "all",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        department_id: "all",
        reason: "",
      });
    }
  }, [restriction, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.leave_type_id === "all") payload.leave_type_id = null;
    if (payload.department_id === "all") payload.department_id = null;

    const result = isEditing
      ? await update(restriction._id, payload)
      : await create(payload);

    if (result) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} Restriction</DialogTitle>
          <DialogDescription>
            Freeze leave during specific periods.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Leave Type</Label>
              <Select
                value={formData.leave_type_id || "all"}
                onValueChange={(val) =>
                  setFormData({ ...formData, leave_type_id: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {leaveTypes.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dept">Department</Label>
              <Select
                value={formData.department_id || "all"}
                onValueChange={(val) =>
                  setFormData({ ...formData, department_id: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d._id} value={d._id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start">From</Label>
              <Input
                id="start"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end">To</Label>
              <Input
                id="end"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
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
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
