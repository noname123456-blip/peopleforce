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
import { Loader2, Check } from "lucide-react";
import { useCreate } from "@/hooks/use-create";
import { useUpdate } from "@/hooks/use-update";
import { useList } from "@/hooks/use-list";
import { cn } from "@/lib/utils";

interface OnboardingTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  task?: any;
}

export function OnboardingTaskDialog({
  open,
  onOpenChange,
  onSuccess,
  task,
}: OnboardingTaskDialogProps) {
  const [formData, setFormData] = useState({
    task_title: "",
    stage_id: "",
    candidates: [] as string[],
    employee_id: [] as string[],
  });

  const { create, loading: creating } = useCreate("/onboarding/tasks");
  const { update, loading: updating } = useUpdate("/onboarding/tasks");
  const { data: stages } = useList<any>("/onboarding");
  const { data: employees = [] } = useList<any>("/employees", { defaultLimit: 100 });
  const { data: candidates = [] } = useList<any>("/candidates", { defaultLimit: 100 });

  useEffect(() => {
    if (task) {
      setFormData({
        task_title: task.task_title || "",
        stage_id: task.stage_id?._id || task.stage_id || "",
        candidates: task.candidates?.map((c: any) => c._id || c) || [],
        employee_id: task.employee_id?.map((e: any) => e._id || e) || [],
      });
    } else {
      setFormData({
        task_title: "",
        stage_id: "",
        candidates: [],
        employee_id: [],
      });
    }
  }, [task, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.stage_id) return;
    
    let success = false;
    if (task) {
      success = !!(await update(task._id, formData, {
        successMessage: "Task updated successfully",
      }));
    } else {
      success = !!(await create(formData, {
        successMessage: "Task created successfully",
      }));
    }

    if (success) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const toggleItem = (field: "candidates" | "employee_id", id: string) => {
    setFormData((prev) => {
      const list = prev[field];
      const isSelected = list.includes(id);
      if (isSelected) {
        return { ...prev, [field]: list.filter((i) => i !== id) };
      }
      return { ...prev, [field]: [...list, id] };
    });
  };

  const loading = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
          <DialogDescription>
            {task
              ? "Update onboarding task details."
              : "Create a new task for an onboarding stage."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="task_title">Task Title *</Label>
            <Input
              id="task_title"
              value={formData.task_title}
              onChange={(e) =>
                setFormData({ ...formData, task_title: e.target.value })
              }
              placeholder="e.g. Complete NDA signing"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="stage">Onboarding Stage *</Label>
            <Select
              value={formData.stage_id || undefined}
              onValueChange={(val) =>
                setFormData({ ...formData, stage_id: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stage..." />
              </SelectTrigger>
              <SelectContent>
                {stages?.map((s: any) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.stage_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Assign Candidates</Label>
              <div className="max-h-[160px] overflow-y-auto border rounded-md p-2 bg-muted/20 space-y-1">
                {candidates.map((c: any) => (
                  <div
                    key={c._id}
                    onClick={() => toggleItem("candidates", c._id)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors text-xs",
                      formData.candidates.includes(c._id) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <div className={cn(
                      "size-3.5 rounded-sm border flex items-center justify-center shrink-0",
                      formData.candidates.includes(c._id) ? "bg-primary border-primary" : "border-muted-foreground/30"
                    )}>
                      {formData.candidates.includes(c._id) && <Check className="size-2.5 text-white" />}
                    </div>
                    <span className="truncate">{c.name}</span>
                  </div>
                ))}
                {candidates.length === 0 && <span className="text-[10px] text-muted-foreground">No candidates</span>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Assign Employees</Label>
              <div className="max-h-[160px] overflow-y-auto border rounded-md p-2 bg-muted/20 space-y-1">
                {employees.map((emp: any) => (
                  <div
                    key={emp._id}
                    onClick={() => toggleItem("employee_id", emp._id)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-colors text-xs",
                      formData.employee_id.includes(emp._id) ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <div className={cn(
                      "size-3.5 rounded-sm border flex items-center justify-center shrink-0",
                      formData.employee_id.includes(emp._id) ? "bg-primary border-primary" : "border-muted-foreground/30"
                    )}>
                      {formData.employee_id.includes(emp._id) && <Check className="size-2.5 text-white" />}
                    </div>
                    <span className="truncate">{emp.employee_first_name} {emp.employee_last_name}</span>
                  </div>
                ))}
                {employees.length === 0 && <span className="text-[10px] text-muted-foreground">No employees</span>}
              </div>
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
            <Button type="submit" disabled={loading || !formData.stage_id}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
