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

interface AssignLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allocation: any;
  onSuccess: () => void;
}

export function AssignLeaveDialog({
  open,
  onOpenChange,
  allocation,
  onSuccess,
}: AssignLeaveDialogProps) {
  const isEditing = !!allocation?._id;
  const { create, loading: creating } = useCreate("/leave/allocations");
  const { update, loading: updating } = useUpdate("/leave/allocations");
  const loading = creating || updating;

  const { data: employees } = useList<any>("/employees", { defaultLimit: 100 });
  const { data: leaveTypes } = useList<any>("/leave/types");

  const [formData, setFormData] = useState<any>({
    employee_id: "",
    leave_type_id: "",
    available_days: 0,
    carryforward_days: 0,
    total_leave_days: 0,
  });

  useEffect(() => {
    if (allocation) {
      setFormData({
        employee_id:
          allocation.employee_id?._id || allocation.employee_id || "",
        leave_type_id:
          allocation.leave_type_id?._id || allocation.leave_type_id || "",
        available_days: allocation.available_days || 0,
        carryforward_days: allocation.carryforward_days || 0,
        total_leave_days: allocation.total_leave_days || 0,
      });
    } else {
      setFormData({
        employee_id: "",
        leave_type_id: "",
        available_days: 0,
        carryforward_days: 0,
        total_leave_days: 0,
      });
    }
  }, [allocation, open]);

  useEffect(() => {
    const total =
      Number(formData.available_days) + Number(formData.carryforward_days);
    if (formData.total_leave_days !== total) {
      setFormData((prev: any) => ({ ...prev, total_leave_days: total }));
    }
  }, [formData.available_days, formData.carryforward_days]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = isEditing
      ? await update(allocation._id, formData)
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
          <DialogTitle>{isEditing ? "Edit" : "Assign"} Leave</DialogTitle>
          <DialogDescription>
            Assign leave balance to an employee.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="employee">Employee</Label>
            <Select
              value={formData.employee_id}
              onValueChange={(val) =>
                setFormData({ ...formData, employee_id: val })
              }
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp._id} value={emp._id}>
                    {emp.employee_first_name} {emp.employee_last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select
              value={formData.leave_type_id}
              onValueChange={(val) =>
                setFormData({ ...formData, leave_type_id: val })
              }
              disabled={isEditing}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type._id} value={type._id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="available">Available Days</Label>
              <Input
                id="available"
                type="number"
                value={formData.available_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    available_days: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="carryforward">Carry Forward</Label>
              <Input
                id="carryforward"
                type="number"
                value={formData.carryforward_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    carryforward_days: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="total">Total Days</Label>
            <Input
              id="total"
              type="number"
              value={formData.total_leave_days}
              readOnly
              className="bg-muted"
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
              {isEditing ? "Update" : "Assign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
