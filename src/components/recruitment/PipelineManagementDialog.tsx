"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreate } from "@/hooks/use-create";
import { useUpdate } from "@/hooks/use-update";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { apiRequest } from "@/utils/api";
import { 
    Plus, 
    X, 
    ListOrdered, 
    Settings2, 
    Trash2, 
    ChevronRight, 
    ChevronLeft,
    LayoutDashboard, 
    Workflow,
    CheckCircle2,
    Users,
    Sparkles,
    PanelLeftClose,
    PanelLeftOpen
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

interface PipelineManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialRecruitmentId?: string | null;
}

const STAGE_TYPES = ["initial", "applied", "test", "interview", "cancelled", "hired"];

function SortableStageItem({ 
    s, 
    index, 
    handleUpdateStageType, 
    handleRemoveStage 
}: { 
    s: any; 
    index: number; 
    handleUpdateStageType: (s: any, val: string) => void;
    handleRemoveStage: (s: any, i: number) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: s._id || `temp-${index}` });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
    };

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className={cn(
                "group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-white/5 px-6 py-4 rounded-2xl hover:border-primary/40 transition-all hover:bg-slate-900/80",
                isDragging && "opacity-50 ring-2 ring-primary/40 border-primary/40 shadow-2xl z-50"
            )}
        >
            <div className="flex items-center gap-6 flex-1 min-w-0">
                <div 
                    {...attributes} 
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/5 rounded-md transition-colors"
                >
                    <GripVertical className="size-4 text-slate-600" />
                </div>
                <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-sm text-primary shrink-0">
                    {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-white tracking-tight truncate">{s.stage}</p>
                    <Badge className="bg-white/5 border-none text-[9px] font-bold uppercase text-slate-500 tracking-widest px-0 h-auto">
                        {s.stage_type}
                    </Badge>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Select 
                    value={s.stage_type} 
                    onValueChange={(val) => handleUpdateStageType(s, val)}
                >
                    <SelectTrigger className="w-[130px] h-9 bg-white/5 border-white/10 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all rounded-lg">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 rounded-xl">
                        {STAGE_TYPES.map(type => (
                            <SelectItem key={type} value={type} className="text-[10px] font-bold uppercase tracking-widest">{type}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <button 
                    onClick={() => handleRemoveStage(s, index)}
                    className="p-2 rounded-xl text-slate-500 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                >
                    <Trash2 className="size-4" />
                </button>
            </div>
        </div>
    );
}

export function PipelineManagementDialog({
  open,
  onOpenChange,
  onSuccess,
  initialRecruitmentId,
}: PipelineManagementDialogProps) {
  const [activeRecruitmentId, setActiveRecruitmentId] = useState<string | null>(initialRecruitmentId || null);
  const [activeTab, setActiveTab] = useState("general");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: allRecruitments, refetch: refetchAllRecruitments } = useList<any>("/recruitment", {
    autoFetch: open
  });

  const { create: createRecruitment, loading: creatingRecruitment } = useCreate<any>("/recruitment");
  const { update: updateRecruitment, loading: updatingRecruitment } = useUpdate("/recruitment");
  const { create: createStage } = useCreate<any>("/stages");
  const { update: updateStage } = useUpdate("/stages");
  const { delete: deleteStage } = useDelete("/stages");

  const { data: currentRecruitmentData } = useList<any>("/recruitment", {
    initialFilters: { _id: activeRecruitmentId },
    autoFetch: !!activeRecruitmentId && open,
  });

  const { data: currentStages, refetch: refetchStages } = useList<any>("/stages", {
    initialFilters: { recruitment_id: activeRecruitmentId, sortBy: "sequence" },
    autoFetch: !!activeRecruitmentId && open,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    vacancy: 1,
  });

  const [stages, setStages] = useState<any[]>([]);
  const [newStageName, setNewStageName] = useState("");
  const [newStageType, setNewStageType] = useState("interview");

  const DEFAULT_STAGES = [
    { stage: "Applied", stage_type: "applied", sequence: 1 },
    { stage: "Initial Screening", stage_type: "initial", sequence: 2 },
    { stage: "Technical Interview", stage_type: "interview", sequence: 3 },
    { stage: "Offer", stage_type: "interview", sequence: 4 },
    { stage: "Hired", stage_type: "hired", sequence: 5 },
  ];

  useEffect(() => {
    setActiveRecruitmentId(initialRecruitmentId || null);
  }, [initialRecruitmentId, open]);

  useEffect(() => {
    if (activeRecruitmentId && currentRecruitmentData?.[0]) {
      const r = currentRecruitmentData[0];
      setFormData({
        title: r.title || "",
        description: r.description || "",
        vacancy: r.vacancy || 1,
      });
    } else if (!activeRecruitmentId) {
      setFormData({ title: "", description: "", vacancy: 1 });
      setStages(DEFAULT_STAGES);
    }
  }, [activeRecruitmentId, currentRecruitmentData, open]);

  useEffect(() => {
    if (activeRecruitmentId && currentStages) {
      setStages(currentStages);
    }
  }, [currentStages, activeRecruitmentId]);

  const handleAddStage = async () => {
    if (!newStageName) return;
    
    const newStage = {
      stage: newStageName,
      stage_type: newStageType,
      sequence: stages.length + 1,
      recruitment_id: activeRecruitmentId,
    };

    if (activeRecruitmentId) {
      await createStage(newStage);
      refetchStages();
    } else {
      setStages([...stages, newStage]);
    }
    setNewStageName("");
  };

  const handleRemoveStage = async (stage: any, index: number) => {
    if (activeRecruitmentId && stage?._id) {
      await deleteStage(stage._id);
      refetchStages();
    } else {
      setStages(stages.filter((_, i) => i !== index));
    }
  };

  const handleUpdateStageType = async (stage: any, newType: string) => {
    if (activeRecruitmentId && stage._id) {
        await updateStage(stage._id, { stage_type: newType });
        refetchStages();
    } else {
        const newStages = [...stages];
        const target = newStages.find(s => s === stage);
        if (target) target.stage_type = newType;
        setStages(newStages);
    }
  };

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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stages.findIndex(s => (s._id || `temp-${stages.indexOf(s)}`) === active.id);
    const newIndex = stages.findIndex(s => (s._id || `temp-${stages.indexOf(s)}`) === over.id);

    const reorderedStages = arrayMove(stages, oldIndex, newIndex);
    
    // Update sequences locally
    const updatedStages = reorderedStages.map((s, idx) => ({
        ...s,
        sequence: idx + 1
    }));
    
    setStages(updatedStages);

    // If persistent, update backend
    if (activeRecruitmentId) {
        const payload = updatedStages.map(s => ({ _id: s._id, sequence: s.sequence }));
        await apiRequest("PATCH", "/stages", payload);
        refetchStages();
        onSuccess();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeRecruitmentId) {
      await updateRecruitment(activeRecruitmentId, formData, { successMessage: "Pipeline details synchronized" });
      onSuccess();
      refetchAllRecruitments();
    } else {
      const recruitment = await createRecruitment(formData) as any;
      if (recruitment && recruitment._id) {
        for (const stage of stages) {
          await createStage({ ...stage, recruitment_id: recruitment._id });
        }
        setActiveRecruitmentId(recruitment._id);
        onSuccess();
        refetchAllRecruitments();
        setActiveTab("workflow"); // Move to workflow after creating
      }
    }
  };

  const loading = creatingRecruitment || updatingRecruitment;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[60vw] w-full h-[85vh] overflow-hidden p-0 bg-slate-950 border-white/5 shadow-xl rounded-[2rem]">
        <div className="flex h-full w-full overflow-hidden">
          {/* Sidebar / Quick Select */}
          <div className={cn(
            "shrink-0 border-r border-white/5 bg-slate-900/40 flex flex-col transition-all duration-300 h-full relative",
            isCollapsed ? "w-[80px] p-4" : "w-[280px] p-8"
          )}>
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-10 size-6 bg-primary rounded-full flex items-center justify-center text-white shadow-lg z-50 hover:scale-110 active:scale-95 transition-all"
            >
                {isCollapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
            </button>

            <div className={cn("flex items-center gap-4 mb-8", isCollapsed && "justify-center")}>
                <div className="p-2.5 rounded-2xl bg-primary/20 ring-1 ring-primary/40 shadow-inner shrink-0">
                    <Sparkles className="size-5 text-primary" />
                </div>
                {!isCollapsed && (
                    <div className="min-w-0 animate-in fade-in duration-300">
                        <h3 className="text-sm font-bold text-white tracking-tight uppercase truncate">Pipeline Studio</h3>
                        <p className="text-[9px] text-muted-foreground font-medium tracking-widest opacity-50 uppercase">v2.0</p>
                    </div>
                )}
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden">
                <Button 
                    variant="ghost" 
                    onClick={() => {
                        setActiveRecruitmentId(null);
                        setActiveTab("general");
                    }}
                    className={cn(
                        "w-full justify-start gap-3 h-11 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                        isCollapsed ? "justify-center px-0" : "px-4",
                        !activeRecruitmentId ? "bg-primary text-white shadow-md" : "text-slate-500 hover:text-white hover:bg-white/5"
                    )}
                >
                    <Plus className="size-4 shrink-0" />
                    {!isCollapsed && <span className="animate-in fade-in duration-300">New Pipeline</span>}
                </Button>

                <div className="my-6 h-px bg-white/5" />

                {!isCollapsed && <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2 animate-in fade-in duration-300">Active Pipelines</p>}
                
                <div className="space-y-1">
                    {allRecruitments?.map((r: any) => (
                        <Button
                            key={r._id}
                            variant="ghost"
                            onClick={() => setActiveRecruitmentId(r._id)}
                            className={cn(
                                "w-full justify-start gap-4 h-11 rounded-xl text-[11px] font-medium transition-all group overflow-hidden",
                                isCollapsed ? "justify-center px-0" : "px-4",
                                activeRecruitmentId === r._id ? "bg-white/5 text-white border border-white/10" : "text-slate-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className={cn("size-1.5 rounded-full shrink-0", activeRecruitmentId === r._id ? "bg-primary" : "bg-slate-700")} />
                            {!isCollapsed && <span className="truncate flex-1 text-left animate-in fade-in duration-300">{r.title}</span>}
                            {!isCollapsed && <ChevronRight className={cn("size-3 opacity-0 group-hover:opacity-100 transition-opacity", activeRecruitmentId === r._id && "opacity-100")} />}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-white/5 shrink-0">
                <Button 
                    variant="ghost" 
                    onClick={() => onOpenChange(false)}
                    className={cn(
                        "w-full justify-start gap-3 h-10 text-slate-500 hover:text-destructive text-[10px] font-bold uppercase tracking-widest transition-colors",
                        isCollapsed ? "justify-center px-0" : "px-4"
                    )}
                >
                    <X className="size-4 shrink-0" />
                    {!isCollapsed && <span className="animate-in fade-in duration-300">Close Session</span>}
                </Button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-slate-950/40 backdrop-blur-3xl h-full overflow-hidden">
            <header className="p-10 pb-8 border-b border-white/5 shrink-0">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                            {activeRecruitmentId ? "Pipeline Configuration" : "New Recruitment Pipeline"}
                        </h2>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 opacity-60">
                            {activeRecruitmentId ? "Modify hire stages and parameters" : "Initialize your recruitment workflow"}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl shrink-0 self-start xl:self-center">
                        <button 
                            onClick={() => setActiveTab("general")}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === "general" ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white"
                            )}
                        >
                            <LayoutDashboard className="size-4" /> Parameters
                        </button>
                        <button 
                            onClick={() => setActiveTab("workflow")}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === "workflow" ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-white"
                            )}
                        >
                            <Workflow className="size-4" /> Phasing
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                {activeTab === "general" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="grid gap-10 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-3 ml-1">
                                        <div className="size-1 bg-primary rounded-full" /> Pipeline Name
                                    </Label>
                                    <Input
                                        placeholder="e.g. Senior Software Engineer"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="h-12 bg-white/5 border-white/10 rounded-xl text-white text-sm font-semibold placeholder:text-slate-700 focus:ring-primary/40 focus:border-primary/40 transition-all hover:bg-white/[0.07]"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-3 ml-1">
                                        <div className="size-1 bg-primary rounded-full" /> Openings
                                    </Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={formData.vacancy}
                                        onChange={(e) => setFormData({ ...formData, vacancy: parseInt(e.target.value) })}
                                        className="h-12 bg-white/5 border-white/10 rounded-xl text-white text-sm font-semibold focus:ring-primary/40 hover:bg-white/[0.07] transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-3 ml-1">
                                    <div className="size-1 bg-primary rounded-full" /> Description
                                </Label>
                                <Textarea
                                    placeholder="Write a brief description for this pipeline..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="min-h-[200px] bg-white/5 border-white/10 rounded-2xl text-white text-sm font-medium leading-relaxed focus:ring-primary/40 resize-none p-6 hover:bg-white/[0.07] transition-all"
                                    required
                                />
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === "workflow" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl space-y-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Workflow className="size-4 text-primary" />
                                </div>
                                <span className="text-lg font-bold text-white tracking-tight">Recruitment Stages</span>
                            </div>
                            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary font-bold text-[10px] uppercase tracking-widest px-4 py-1 rounded-full">
                                {stages.length} Stages
                            </Badge>
                        </div>

                        {/* Stage Addition */}
                        <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                            <Input
                                placeholder="Add a stage (e.g. Technical Interview)"
                                value={newStageName}
                                onChange={(e) => setNewStageName(e.target.value)}
                                className="h-11 bg-slate-950/60 border-white/10 rounded-xl text-sm font-medium placeholder:text-slate-600 focus:ring-primary/40 px-4 flex-1"
                            />
                            <Select value={newStageType} onValueChange={setNewStageType}>
                                <SelectTrigger className="h-11 w-full sm:w-[150px] bg-slate-950/60 border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest px-4">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-white/10 rounded-xl">
                                    {STAGE_TYPES.map(type => (
                                        <SelectItem key={type} value={type} className="text-[10px] font-bold uppercase tracking-widest">{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button 
                                onClick={handleAddStage}
                                className="h-11 px-8 bg-primary hover:bg-primary/90 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all active:scale-95"
                            >
                                <Plus className="size-4 mr-2" /> Add Stage
                            </Button>
                        </div>

                        {/* Stages List */}
                        <div className="space-y-4">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={stages.map((s, i) => s._id || `temp-${i}`)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {stages.map((s, i) => (
                                        <SortableStageItem 
                                            key={s._id || `temp-${i}`}
                                            s={s}
                                            index={i}
                                            handleUpdateStageType={handleUpdateStageType}
                                            handleRemoveStage={handleRemoveStage}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                    </div>
                )}
            </main>
            
            <footer className="mt-auto p-10 py-8 flex items-center justify-between border-t border-white/5 bg-slate-900/40 backdrop-blur-2xl shrink-0">

                
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)} 
                        className="h-12 px-8 font-bold text-[10px] uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="h-12 px-10 bg-primary hover:bg-primary/90 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95"
                    >
                        {loading ? "Saving..." : activeRecruitmentId ? "Save Changes" : "Create Pipeline"}
                    </Button>
                </div>
            </footer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
