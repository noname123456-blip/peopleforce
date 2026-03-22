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
import { Loader2 } from "lucide-react";

interface CompanyLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leave: any;
  onSuccess: () => void;
}

const WEEK_DAYS = [
  { label: "Sunday", value: "0" },
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
];

const WEEKS = [
  { label: "Every Week", value: "" },
  { label: "1st Week", value: "1" },
  { label: "2nd Week", value: "2" },
  { label: "3rd Week", value: "3" },
  { label: "4th Week", value: "4" },
];

export function CompanyLeaveDialog({
  open,
  onOpenChange,
  leave,
  onSuccess,
}: CompanyLeaveDialogProps) {
  const isEditing = !!leave?._id;
  const { create, loading: creating } = useCreate("/leave/company-leaves");
  const { update, loading: updating } = useUpdate("/leave/company-leaves");
  const loading = creating || updating;

  const [formData, setFormData] = useState<any>({
    based_on_week: "",
    based_on_week_day: "0",
  });

  useEffect(() => {
    if (leave) {
      setFormData({
        based_on_week: leave.based_on_week === null ? "" : leave.based_on_week,
        based_on_week_day: leave.based_on_week_day || "0",
      });
    } else {
      setFormData({
        based_on_week: "",
        based_on_week_day: "0",
      });
    }
  }, [leave, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (payload.based_on_week === "") payload.based_on_week = null;

    const result = isEditing
      ? await update(leave._id, payload)
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
          <DialogTitle>{isEditing ? "Edit" : "Add"} Company Leave</DialogTitle>
          <DialogDescription>
            Configure recurring company-wide off days.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="week">Based On Week</Label>
            <Select
              value={formData.based_on_week}
              onValueChange={(val) =>
                setFormData({ ...formData, based_on_week: val })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEKS.map((w) => (
                  <SelectItem key={w.value} value={w.value}>
                    {w.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="day">Week Day</Label>
            <Select
              value={formData.based_on_week_day}
              onValueChange={(val) =>
                setFormData({ ...formData, based_on_week_day: val })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WEEK_DAYS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
