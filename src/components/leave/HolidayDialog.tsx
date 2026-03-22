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
import { Switch } from "@/components/ui/switch";
import { useCreate } from "@/hooks/use-create";
import { useUpdate } from "@/hooks/use-update";
import { Loader2 } from "lucide-react";

interface HolidayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  holiday: any;
  onSuccess: () => void;
}

export function HolidayDialog({
  open,
  onOpenChange,
  holiday,
  onSuccess,
}: HolidayDialogProps) {
  const isEditing = !!holiday?._id;
  const { create, loading: creating } = useCreate("/leave/holidays");
  const { update, loading: updating } = useUpdate("/leave/holidays");
  const loading = creating || updating;

  const [formData, setFormData] = useState<any>({
    name: "",
    start_date: "",
    end_date: "",
    recurring: false,
  });

  useEffect(() => {
    if (holiday) {
      setFormData({
        name: holiday.name || "",
        start_date: holiday.start_date
          ? new Date(holiday.start_date).toISOString().split("T")[0]
          : "",
        end_date: holiday.end_date
          ? new Date(holiday.end_date).toISOString().split("T")[0]
          : "",
        recurring: holiday.recurring || false,
      });
    } else {
      setFormData({
        name: "",
        start_date: new Date().toISOString().split("T")[0],
        end_date: "",
        recurring: false,
      });
    }
  }, [holiday, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.end_date) delete payload.end_date;

    const result = isEditing
      ? await update(holiday._id, payload)
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
          <DialogTitle>{isEditing ? "Edit" : "Add"} Holiday</DialogTitle>
          <DialogDescription>
            Add a public or company holiday to the calendar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Holiday Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. New Year's Day"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>Recurring Holiday</Label>
              <div className="text-[11px] text-muted-foreground">
                Repeats every year on the same date.
              </div>
            </div>
            <Switch
              checked={formData.recurring}
              onCheckedChange={(val) =>
                setFormData({ ...formData, recurring: val })
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
