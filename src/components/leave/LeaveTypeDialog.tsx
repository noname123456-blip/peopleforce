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
import { Loader2 } from "lucide-react";

interface LeaveTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveType: any;
  onSuccess: () => void;
}

export function LeaveTypeDialog({
  open,
  onOpenChange,
  leaveType,
  onSuccess,
}: LeaveTypeDialogProps) {
  const isEditing = !!leaveType?._id;
  const { create, loading: creating } = useCreate("/leave/types");
  const { update, loading: updating } = useUpdate("/leave/types");
  const loading = creating || updating;

  const [formData, setFormData] = useState<any>({
    name: "",
    payment: "paid",
    total_days: 12,
    carryforward_type: "no carryforward",
    require_approval: "yes",
    color: "#3b82f6",
  });

  useEffect(() => {
    if (leaveType) {
      setFormData({
        name: leaveType.name || "",
        payment: leaveType.payment || "paid",
        total_days: leaveType.total_days || 12,
        carryforward_type: leaveType.carryforward_type || "no carryforward",
        require_approval: leaveType.require_approval || "yes",
        color: leaveType.color || "#3b82f6",
      });
    } else {
      setFormData({
        name: "",
        payment: "paid",
        total_days: 12,
        carryforward_type: "no carryforward",
        require_approval: "yes",
        color: "#3b82f6",
      });
    }
  }, [leaveType, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = isEditing
      ? await update(leaveType._id, formData)
      : await create(formData);

    if (result) {
      onSuccess();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} Leave Type</DialogTitle>
          <DialogDescription>
            Configure policy for this leave type.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="payment">Payment</Label>
              <Select
                value={formData.payment}
                onValueChange={(val) =>
                  setFormData({ ...formData, payment: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="total_days">Days Per Year</Label>
              <Input
                id="total_days"
                type="number"
                value={formData.total_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_days: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="carryforward">Carry Forward</Label>
            <Select
              value={formData.carryforward_type}
              onValueChange={(val) =>
                setFormData({ ...formData, carryforward_type: val })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no carryforward">
                  No Carry Forward
                </SelectItem>
                <SelectItem value="carryforward">Carry Forward</SelectItem>
                <SelectItem value="carryforward expire">
                  Carry Forward (Expire)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                className="w-12 h-9 p-1"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
              <Input
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="flex-1"
              />
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
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
