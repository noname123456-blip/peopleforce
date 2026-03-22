"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CandidateCard } from "./CandidateCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KanbanColumnProps {
  stage: any;
  candidates: any[];
  onEditCandidate: (candidate: any) => void;
  onQuickAdd: (stageId: string) => void;
  allStages?: any[];
  color?: string;
}

export function KanbanColumn({
  stage,
  candidates,
  onEditCandidate,
  onQuickAdd,
  allStages = [],
  color = "bg-primary",
}: KanbanColumnProps) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: stage._id,
    data: {
      type: "column",
      stage,
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: stage._id,
    data: {
      type: "column",
      stage,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const candidateIds = candidates.map((c) => c._id);

  return (
    <div 
        ref={setSortableRef} 
        style={style}
        className={cn(
            "flex w-[320px] shrink-0 flex-col rounded-2xl border border-border/40 bg-slate-50/5 backdrop-blur-xl dark:bg-slate-950/20 shadow-xl overflow-hidden group/column transition-all",
            isDragging && "opacity-50 scale-95 z-50 ring-2 ring-primary/20 shadow-2xl"
        )}
    >
      {/* Column Header */}
      <div className="relative p-5 pb-3">
        <div className={cn("absolute top-0 left-0 w-full h-1", color)} />
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div 
                {...attributes} 
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-white/5 rounded-md transition-colors"
            >
                <GripVertical className="size-3.5 text-muted-foreground/40 hover:text-primary transition-colors" />
            </div>
            <div
                className={cn(
                    "flex size-6 items-center justify-center rounded-lg text-white text-[10px] font-black shadow-sm shrink-0",
                    color
                )}
            >
                {stage.sequence || 0}
            </div>
            <h3 className="text-sm font-black truncate tracking-tight uppercase overflow-hidden text-ellipsis">
              {stage.stage}
            </h3>
          </div>
          <Badge
            variant="secondary"
            className="h-5 min-w-[20px] justify-center rounded-full px-1.5 text-[10px] font-black bg-primary/10 text-primary border-none"
          >
            {candidates.length}
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-1">
            <p className="text-[10px] text-muted-foreground/60 font-semibold tracking-widest uppercase">
            {stage.stage_type || "process"}
            </p>
            <p className="text-[9px] text-muted-foreground/50 font-medium truncate max-w-[140px]">
                {stage.stage_managers?.length > 0 
                    ? `Mgrs: ${stage.stage_managers.map((m: any) => m.employee_first_name).join(", ")}`
                    : "No Managers"}
            </p>
        </div>

        <div className="absolute right-4 top-5 opacity-0 group-hover/column:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="size-7 rounded-full hover:bg-primary/5 text-muted-foreground">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </div>

      {/* Droppable Area */}
      <div
        ref={setDroppableRef}
        className={cn(
          "flex-1 space-y-3 p-4 pt-2 overflow-y-auto max-h-[calc(100vh-340px)] custom-scrollbar min-h-[200px] transition-colors duration-200",
          isOver && "bg-primary/5 border-2 border-dashed border-primary/20 rounded-xl"
        )}
      >
        <SortableContext items={candidateIds} strategy={verticalListSortingStrategy}>
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate._id}
              candidate={candidate}
              onEdit={onEditCandidate}
              allStages={allStages}
            />
          ))}
        </SortableContext>

        {candidates.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-border/20 bg-background/5 p-6 text-center group/empty transition-all hover:bg-background/10 hover:border-primary/20">
            <div className="size-8 rounded-full bg-muted/20 flex items-center justify-center mb-2 group-hover/empty:scale-110 transition-transform">
              <Plus className="size-4 text-muted-foreground/40 group-hover/empty:text-primary/60" />
            </div>
            <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest group-hover/empty:text-primary/40">
              Empty Stage
            </p>
          </div>
        )}
      </div>

      {/* Column Footer */}
      <div className="p-3 border-t border-border/10 bg-muted/5">
        <Button
          variant="ghost"
          onClick={() => onQuickAdd(stage._id)}
          className="w-full justify-start gap-2 h-9 text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl border border-transparent hover:border-primary/10 transition-all"
        >
          <Plus className="size-3.5" />
          Quick Add
        </Button>
      </div>
    </div>
  );
}
