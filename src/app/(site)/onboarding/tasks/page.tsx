"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, ListChecks } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { OnboardingTaskDialog } from "@/components/onboarding/OnboardingTaskDialog";

export default function OnboardingTasksPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const { data: tasks, loading, refetch } = useList<any>("/onboarding/tasks");
  const { delete: deleteTask } = useDelete("/onboarding/tasks");

  const filtered = tasks.filter((t: any) =>
    t.task_title.toLowerCase().includes(search.toLowerCase()),
  );

  // Group by stage
  const grouped = filtered.reduce(
    (acc: Record<string, any[]>, t: any) => {
      const stageName = t.stage_id?.stage_title || "Unassigned";
      if (!acc[stageName]) acc[stageName] = [];
      acc[stageName].push(t);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      const success = await deleteTask(id);
      if (success) refetch();
    }
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Onboarding Tasks
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage checklist tasks for the onboarding process
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-[200px] pl-9"
            />
          </div>
          <Button size="sm" className="gap-2" onClick={handleCreate}>
            <Plus className="size-3.5" />
            Add Task
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader variant="dots" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
          <ListChecks className="size-10 mb-3 opacity-30" />
          <p>No tasks found.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={handleCreate}
          >
            Add First Task
          </Button>
        </div>
      ) : (
        Object.entries(grouped).map(([stage, items]) => (
          <Card key={stage}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="size-4 text-primary" />
                {stage}
                <Badge variant="secondary" className="text-[10px]">
                  {items.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map((task: any) => (
                <div
                  key={task._id}
                  className="group flex items-center gap-3 rounded-lg border border-border/50 bg-muted/20 p-3 hover:bg-muted/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{task.task_title}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.employee_id?.length
                        ? `Assigned to ${task.employee_id.length} employee(s)`
                        : "No assignees"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => handleEdit(task)}
                    >
                      <Pencil className="size-3.5 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => handleDelete(task._id)}
                    >
                      <Trash2 className="size-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))
      )}

      <OnboardingTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
