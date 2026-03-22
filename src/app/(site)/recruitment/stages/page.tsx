"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  ArrowRight,
  Settings2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { Loader } from "@/components/ui/loader";
import { StageDialog } from "@/components/recruitment/StageDialog";
import { apiRequest } from "@/utils/api";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { createPortal } from "react-dom";

const stageColors: Record<string, string> = {
  Applied: "#6b7280",
  Initial: "#f59e0b",
  Test: "#3b82f6",
  Interview: "#8b5cf6",
  Offer: "#10b981",
  Hired: "#059669",
  Rejected: "#ef4444",
};

export default function StagesPage() {
  const [selectedRecruitmentId, setSelectedRecruitmentId] = useState<
    string | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<any>(null);
  const [activeStage, setActiveStage] = useState<any>(null);
  const [localStages, setLocalStages] = useState<any[]>([]);

  const { data: recruitments, loading: loadingRecruitments } =
    useList<any>("/recruitment");

  useEffect(() => {
    if (recruitments && recruitments.length > 0 && !selectedRecruitmentId) {
      setSelectedRecruitmentId(recruitments[0]._id);
    }
  }, [recruitments, selectedRecruitmentId]);

  const {
    data: stages,
    loading: loadingStages,
    refetch,
  } = useList<any>("/stages", {
    initialFilters: {
      recruitment_id: selectedRecruitmentId,
      sortBy: "sequence",
    },
  });

  useEffect(() => {
    if (stages) setLocalStages(stages);
  }, [stages]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { delete: deleteStage } = useDelete("/stages");

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

  const handleAdd = () => {
    setEditingStage(null);
    setDialogOpen(true);
  };

  const loading =
    loadingRecruitments || (selectedRecruitmentId && loadingStages);

  const handleDragStart = (event: DragStartEvent) => {
    const stage = localStages.find((s) => s._id === event.active.id);
    setActiveStage(stage);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveStage(null);

    if (!over || active.id === over.id) return;

    const oldIndex = localStages.findIndex((s) => s._id === active.id);
    const newIndex = localStages.findIndex((s) => s._id === over.id);

    const reorderedStages = arrayMove(localStages, oldIndex, newIndex);
    const updates = reorderedStages.map((s, idx) => ({
      _id: s._id,
      sequence: idx + 1,
    }));

    // Optimistic UI
    setLocalStages(reorderedStages);

    try {
      await apiRequest("PATCH", "/stages", updates);
      refetch();
    } catch (err) {
      console.error("Failed to reorder stages:", err);
      setLocalStages(stages); // Rollback
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-xl dark:from-slate-950 dark:via-slate-950 dark:to-primary/5">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 rounded-full bg-primary/20 blur-[80px] pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">
              Pipeline Stages
            </h1>
            <p className="text-slate-400 font-medium">
              Define and order the process milestones for each recruitment
              position
            </p>
          </div>
          <Button
            size="lg"
            className="h-11 gap-2 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20"
            onClick={handleAdd}
          >
            <Plus className="size-4" />
            Create Stage
          </Button>
        </div>
      </div>

      {/* Recruitment Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        {recruitments?.map((r: any) => (
          <button
            key={r._id}
            onClick={() => setSelectedRecruitmentId(r._id)}
            className={cn(
              "flex items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition-all",
              selectedRecruitmentId === r._id
                ? "border-primary/30 bg-primary/5 text-primary shadow-sm"
                : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {r.title}
          </button>
        ))}
        {(!recruitments || recruitments.length === 0) &&
          !loadingRecruitments && (
            <div className="text-sm text-muted-foreground px-2">
              No recruitments found.
            </div>
          )}
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader size="md" />
        </div>
      ) : !selectedRecruitmentId ? (
        <div className="flex justify-center p-20 text-muted-foreground">
          Select a recruitment to view stages
        </div>
      ) : (
        <>
          {/* Visual Pipeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pipeline Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {localStages.length === 0 && (
                  <p className="text-sm text-muted-foreground p-4">
                    No stages found.
                  </p>
                )}
                {localStages.map((stage: any, i: number) => {
                  const color = stageColors[stage.stage] || "#94a3b8";
                  return (
                    <div key={stage._id} className="flex items-center gap-2">
                      <div className="glass-card flex flex-col items-center gap-1.5 rounded-xl border border-border/50 bg-card/50 px-4 py-3 shadow-sm min-w-[120px]">
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-semibold whitespace-nowrap">
                          {stage.stage}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          Seq: {stage.sequence || i + 1}
                        </Badge>
                      </div>
                      {i < localStages.length - 1 && (
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground/40" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stages List */}
          <Card className="glass-card">
            <CardContent className="p-0">
              {localStages.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  No stages configured for this recruitment.
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={localStages.map((s) => s._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {localStages.map((stage, i) => (
                      <SortableStageItem
                        key={stage._id}
                        stage={stage}
                        index={i}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </SortableContext>

                  {typeof document !== "undefined" &&
                    createPortal(
                      <DragOverlay
                        dropAnimation={{
                          sideEffects: defaultDropAnimationSideEffects({
                            styles: { active: { opacity: "0.5" } },
                          }),
                        }}
                      >
                        {activeStage ? (
                          <div className="flex items-center gap-4 bg-card p-4 rounded-xl border border-primary shadow-2xl w-full max-w-[500px]">
                            <div
                              className="flex size-9 items-center justify-center rounded-lg text-white text-xs font-bold shadow-sm"
                              style={{
                                backgroundColor:
                                  stageColors[activeStage.stage] || "#94a3b8",
                              }}
                            >
                              {activeStage.sequence}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{activeStage.stage}</p>
                              <Badge variant="outline" className="text-[10px]">
                                {activeStage.stage_type || "process"}
                              </Badge>
                            </div>
                          </div>
                        ) : null}
                      </DragOverlay>,
                      document.body
                    )}
                </DndContext>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <StageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={refetch}
        stage={editingStage}
        recruitmentId={selectedRecruitmentId}
      />
    </div>
  );
}

function SortableStageItem({ stage, index, onEdit, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage._id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 0,
  };

  const color = stageColors[stage.stage] || "#94a3b8";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-4 border-b border-border/50 px-5 py-4 last:border-0 transition-colors hover:bg-muted/30",
        isDragging && "bg-muted/50 shadow-inner"
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/5 rounded transition-colors"
      >
        <GripVertical className="size-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
      </div>
      <div
        className="flex size-9 items-center justify-center rounded-lg text-white text-xs font-bold shadow-sm"
        style={{ backgroundColor: color }}
      >
        {stage.sequence || index + 1}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold">{stage.stage}</p>
          <Badge variant="outline" className="text-[10px]">
            {stage.stage_type || "process"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Managers:{" "}
          {stage.stage_managers
            ?.map((m: any) => m.employee_first_name)
            .join(", ") || "None"}
        </p>
      </div>
      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => onEdit(stage)}
        >
          <Settings2 className="size-4 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => onEdit(stage)}
        >
          <Pencil className="size-4 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 hover:bg-destructive/10"
          onClick={() => onDelete(stage._id)}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
