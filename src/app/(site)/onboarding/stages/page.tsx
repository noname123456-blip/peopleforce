"use client";

import { useState } from "react";
import { Plus, GripVertical, Pencil, Trash2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { OnboardingStageDialog } from "@/components/onboarding/OnboardingStageDialog";

const stageColors = [
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

export default function OnboardingStagesPage() {
  const { data: stages, loading, refetch } = useList<any>("/onboarding");
  const { delete: deleteStage } = useDelete("/onboarding");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this stage?")) {
      const success = await deleteStage(id);
      if (success) refetch();
    }
  };

  const handleEdit = (stage: any) => {
    setEditingStage(stage);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingStage(null);
    setDialogOpen(true);
  };

  const sorted = [...stages].sort(
    (a: any, b: any) => (a.sequence || 0) - (b.sequence || 0),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Onboarding Stages
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure your onboarding pipeline stages
          </p>
        </div>
        <Button size="sm" className="gap-2" onClick={handleCreate}>
          <Plus className="size-3.5" />
          Add Stage
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader size="md" />
        </div>
      ) : (
        <>
          {sorted.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">
                  Stage Flow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {sorted.map((s: any, i: number) => (
                    <div key={s._id} className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-3 shadow-sm min-w-[120px]">
                        <div
                          className="size-3 rounded-full"
                          style={{
                            backgroundColor:
                              stageColors[i % stageColors.length],
                          }}
                        />
                        <span className="text-xs font-semibold whitespace-nowrap">
                          {s.stage_title}
                        </span>
                        {s.is_final_stage && (
                          <Badge className="text-[9px] bg-emerald-100 text-emerald-700">
                            Final
                          </Badge>
                        )}
                      </div>
                      {i < sorted.length - 1 && (
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground/40" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <p>No stages configured yet.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={handleCreate}
                  >
                    Add First Stage
                  </Button>
                </div>
              ) : (
                sorted.map((s: any, i: number) => (
                  <div
                    key={s._id}
                    className="group flex items-center gap-4 border-b border-border/50 px-5 py-4 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <GripVertical className="size-4 cursor-grab text-muted-foreground/40" />
                    <div
                      className="flex size-9 items-center justify-center rounded-lg text-white text-xs font-bold"
                      style={{
                        backgroundColor: stageColors[i % stageColors.length],
                      }}
                    >
                      {s.sequence || i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{s.stage_title}</p>
                        {s.is_final_stage && (
                          <Badge className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                            Final Stage
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Sequence: {s.sequence || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => handleEdit(s)}
                      >
                        <Pencil className="size-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => handleDelete(s._id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}

      <OnboardingStageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        stage={editingStage}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
