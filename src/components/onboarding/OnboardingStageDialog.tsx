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
import { Loader2, Check } from "lucide-react";
import { useCreate } from "@/hooks/use-create";
import { useUpdate } from "@/hooks/use-update";
import { useList } from "@/hooks/use-list";
import { cn } from "@/lib/utils";

interface OnboardingStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  stage?: any;
}

export function OnboardingStageDialog({
  open,
  onOpenChange,
  onSuccess,
  stage,
}: OnboardingStageDialogProps) {
  const [formData, setFormData] = useState({
    stage_title: "",
    sequence: 1,
    is_final_stage: false,
    employee_id: [] as string[],
  });

  const { create, loading: creating } = useCreate("/onboarding");
  const { update, loading: updating } = useUpdate("/onboarding");
  const { data: employees = [] } = useList<any>("/employees", { defaultLimit: 100 });

  useEffect(() => {
    if (stage) {
      setFormData({
        stage_title: stage.stage_title || "",
        sequence: stage.sequence || 1,
        is_final_stage: stage.is_final_stage || false,
        employee_id: stage.employee_id?.map((e: any) => e._id || e) || [],
      });
    } else {
      setFormData({
        stage_title: "",
        sequence: 1,
        is_final_stage: false,
        employee_id: [],
      });
    }
  }, [stage, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

  const loading = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{stage ? "Edit Stage" : "Add New Stage"}</DialogTitle>
          <DialogDescription>
            {stage
              ? "Update onboarding stage details."
              : "Create a new onboarding stage for candidates."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="stage_title">Stage Title *</Label>
            <Input
              id="stage_title"
              value={formData.stage_title}
              onChange={(e) =>
                setFormData({ ...formData, stage_title: e.target.value })
              }
              placeholder="e.g. Document Verification"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sequence">Sequence Order</Label>
              <Input
                id="sequence"
                type="number"
                min={1}
                value={formData.sequence}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sequence: parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>
            <div className="flex flex-col justify-end pb-2">
              <div className="flex items-center gap-3">
                <Switch
                  checked={formData.is_final_stage}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_final_stage: checked })
                  }
                />
                <Label>Final Stage</Label>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Stage Owners (Employees)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-[160px] overflow-y-auto border rounded-md p-2 bg-muted/20">
              {employees.map((emp: any) => (
                <div
                  key={emp._id}
                  onClick={() => toggleEmployee(emp._id)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm",
                    formData.employee_id.includes(emp._id)
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "size-4 rounded-sm border flex items-center justify-center shrink-0",
                    formData.employee_id.includes(emp._id) ? "bg-primary border-primary" : "border-muted-foreground/30"
                  )}>
                    {formData.employee_id.includes(emp._id) && <Check className="size-3 text-white" />}
                  </div>
                  <span className="truncate">
                    {emp.employee_first_name} {emp.employee_last_name}
                  </span>
                </div>
              ))}
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
              {loading ? "Saving..." : stage ? "Update Stage" : "Create Stage"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
