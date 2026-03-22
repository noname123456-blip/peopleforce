"use client";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState, useCallback, useEffect } from "react";
import { KanbanColumn } from "@/components/recruitment/KanbanColumn";
import { CandidateCard } from "@/components/recruitment/CandidateCard";
import { createPortal } from "react-dom";
import { useUpdate } from "@/hooks/use-update";
import { apiRequest } from "@/utils/api";

interface KanbanBoardProps {
  stages: any[];
  candidates: any[];
  search?: string;
  onUpdate: () => void;
  onEditCandidate: (candidate: any) => void;
  onQuickAdd: (stageId: string) => void;
}

const stageColors: Record<string, string> = {
  Applied: "bg-gray-500",
  Initial: "bg-amber-500",
  Test: "bg-blue-500",
  Interview: "bg-violet-500",
  Offer: "bg-emerald-500",
  Hired: "bg-green-600",
  Rejected: "bg-red-500",
};

import { Ghost, Layers, Plus } from "lucide-react";

export function KanbanBoard({
  stages,
  candidates,
  search = "",
  onUpdate,
  onEditCandidate,
  onQuickAdd,
}: KanbanBoardProps) {
  const [activeCandidate, setActiveCandidate] = useState<any>(null);
  const [activeStage, setActiveStage] = useState<any>(null);
  const [localStages, setLocalStages] = useState<any[]>(stages);
  const { update: updateCandidate } = useUpdate("/candidates");

  useEffect(() => {
    setLocalStages(stages);
  }, [stages]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getCandidatesForStage = useCallback(
    (stageId: string) => {
      return candidates.filter(
        (c) => (c.stage_id?._id === stageId || c.stage_id === stageId) &&
               (c.name.toLowerCase().includes(search.toLowerCase()) || 
                c.email.toLowerCase().includes(search.toLowerCase()))
      );
    },
    [candidates, search]
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "candidate") {
      setActiveCandidate(event.active.data.current.candidate);
    } else if (event.active.data.current?.type === "column") {
      setActiveStage(event.active.data.current.stage);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);
    setActiveStage(null);

    if (!over) return;

    // Handle Stage Reordering
    if (active.data.current?.type === "column" && over.data.current?.type === "column") {
        if (active.id === over.id) return;

        const oldIndex = localStages.findIndex(s => s._id === active.id);
        const newIndex = localStages.findIndex(s => s._id === over.id);

        const reorderedStages = arrayMove(localStages, oldIndex, newIndex);
        const updates = reorderedStages.map((s, idx) => ({
            _id: s._id,
            sequence: idx + 1
        }));

        // Optimistic UI update
        setLocalStages(reorderedStages);

        try {
            await apiRequest("PATCH", "/stages", updates);
            onUpdate();
        } catch (err) {
            console.error("Failed to reorder stages:", err);
            setLocalStages(stages); // Rollback on failure
        }
        return;
    }

    // Handle Candidate Movement
    const candidateId = active.id as string;
    const overId = over.id as string;
    const overType = over.data.current?.type;

    let targetStageId = "";

    if (overType === "column") {
      targetStageId = overId;
    } else if (overType === "candidate") {
      targetStageId = over.data.current?.candidate.stage_id?._id || over.data.current?.candidate.stage_id;
    }

    if (!targetStageId) return;

    const sourceStageId = active.data.current?.candidate.stage_id?._id || active.data.current?.candidate.stage_id;

    if (sourceStageId === targetStageId) return;

    // Trigger update
    try {
      await updateCandidate(candidateId, { stage_id: targetStageId });
      onUpdate();
    } catch (err) {
      console.error("Failed to move candidate:", err);
    }
  };

  if (stages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-40">
        <div className="size-20 rounded-[2rem] bg-slate-800 flex items-center justify-center border border-white/5 shadow-inner animate-pulse">
            <Layers className="size-10 text-slate-500" />
        </div>
        <div className="text-center">
            <p className="text-sm font-bold tracking-tight text-white mb-1 uppercase">Workflow Connection Offline</p>
            <p className="text-[10px] font-medium text-slate-500 max-w-[200px] leading-relaxed">
                Connect a recruitment pipeline or define stages to initialize monitoring
            </p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-8 h-full custom-scrollbar pt-2 px-1">
        <SortableContext items={localStages.map(s => s._id)} strategy={horizontalListSortingStrategy}>
            {localStages.map((stage) => (
                <KanbanColumn
                    key={stage._id}
                    stage={stage}
                    candidates={getCandidatesForStage(stage._id)}
                    onEditCandidate={onEditCandidate}
                    onQuickAdd={onQuickAdd}
                    allStages={stages}
                    color={stageColors[stage.stage] || "bg-slate-400"}
                />
            ))}
        </SortableContext>

        {createPortal(
          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: "0.5",
                  },
                },
              }),
            }}
          >
            {activeCandidate ? (
              <div className="w-[300px]">
                <CandidateCard
                  candidate={activeCandidate}
                  onEdit={onEditCandidate}
                />
              </div>
            ) : activeStage ? (
              <div className="w-[320px] opacity-80 rotate-2 scale-105">
                <KanbanColumn
                  stage={activeStage}
                  candidates={getCandidatesForStage(activeStage._id)}
                  onEditCandidate={onEditCandidate}
                  onQuickAdd={onQuickAdd}
                  allStages={stages}
                  color={stageColors[activeStage.stage] || "bg-slate-400"}
                />
              </div>
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </div>
    </DndContext>
  );
}
