"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  Columns3,
  LayoutList,
  LayoutGrid,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useList } from "@/hooks/use-list";
import { Loader } from "@/components/ui/loader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreateCandidateDialog } from "@/components/recruitment/CreateCandidateDialog";
import { ActionMenu } from "@/components/ui/action-menu";
import { useUpdate } from "@/hooks/use-update";
import { KanbanBoard } from "@/components/recruitment/KanbanBoard";
import { PipelineManagementDialog } from "@/components/recruitment/PipelineManagementDialog";
import { Pencil } from "lucide-react";

// Helper for stage colors
const stageColors: Record<string, string> = {
  Applied: "bg-gray-500",
  Initial: "bg-amber-500",
  Test: "bg-blue-500",
  Interview: "bg-violet-500",
  Offer: "bg-emerald-500",
  Hired: "bg-green-600",
  Rejected: "bg-red-500",
};

export default function RecruitmentPipelinePage() {
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "grid">(
    "kanban",
  );

  // Load viewMode from localStorage on mount
  useEffect(() => {
    const savedViewMode = localStorage.getItem("recruitmentViewMode");
    if (savedViewMode && ["kanban", "list", "grid"].includes(savedViewMode)) {
      setViewMode(savedViewMode as any);
    }
  }, []);

  // Save viewMode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("recruitmentViewMode", viewMode);
  }, [viewMode]);
  const [selectedRecruitmentId, setSelectedRecruitmentId] = useState<
    string | null
  >(null);
  const [search, setSearch] = useState("");
  const [candidateDialogOpen, setCandidateDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);
  const [pipelineManagementOpen, setPipelineManagementOpen] = useState(false);
  const [editPipelineId, setEditPipelineId] = useState<string | null>(null);
  const [quickAddStageId, setQuickAddStageId] = useState<string | null>(null);

  // 1. Fetch Recruitments
  const { data: recruitments, loading: loadingRecruitments, refetch: refetchRecruitments } =
    useList<any>("/recruitment");

  // Set initial selected recruitment
  useEffect(() => {
    if (recruitments && recruitments.length > 0 && !selectedRecruitmentId) {
      setSelectedRecruitmentId(recruitments[0]._id);
    }
  }, [recruitments]);

  // 2. Fetch Stages for selected recruitment
  const {
    data: stages,
    loading: loadingStages,
    refetch: refetchStages,
    updateFilters: updateStageFilters,
  } = useList<any>("/stages", {
    initialFilters: {
      recruitment_id: selectedRecruitmentId,
      sortBy: "sequence",
    },
  });

  // 3. Fetch Candidates for selected recruitment
  const {
    data: candidates,
    loading: loadingCandidates,
    refetch: refetchCandidates,
    updateFilters: updateCandidateFilters,
  } = useList<any>("/candidates", {
    initialFilters: {
      recruitment_id: selectedRecruitmentId,
    },
    defaultLimit: 1000,
  });

  // Re-fetch when selected recruitment changes
  useEffect(() => {
    if (selectedRecruitmentId) {
      updateStageFilters({
        recruitment_id: selectedRecruitmentId,
        sortBy: "sequence",
      });
      updateCandidateFilters({ recruitment_id: selectedRecruitmentId });
    }
  }, [selectedRecruitmentId]);

  const { update: updateCandidate } = useUpdate("/candidates");

  const handleEditCandidate = (candidate: any) => {
    setEditingCandidate(candidate);
    setCandidateDialogOpen(true);
  };

  const handleNewPipeline = () => {
    setEditPipelineId(null);
    setPipelineManagementOpen(true);
  };

  const handlePipelineSettings = () => {
    setEditPipelineId(selectedRecruitmentId);
    setPipelineManagementOpen(true);
  };

  const onCandidateSuccess = () => {
    refetchCandidates();
  };

  const handleQuickAdd = (stageId: string) => {
    setEditingCandidate(null);
    setQuickAddStageId(stageId);
    setCandidateDialogOpen(true);
  };

  const onPipelineSuccess = () => {
    refetchRecruitments();
    refetchStages();
  };

  const handleRefresh = () => {
    refetchCandidates();
    refetchStages();
  };

  const handleStageChange = async (candidate: any, stageId: string) => {
    await updateCandidate(candidate._id, { stage_id: stageId });
    handleRefresh();
  };

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";

  const loading =
    loadingRecruitments ||
    (selectedRecruitmentId && (loadingStages || loadingCandidates));

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-slate-950/40 p-8 shadow-2xl backdrop-blur-3xl dark:bg-slate-950/60">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 size-64 rounded-full bg-linear-to-r from-primary/10 to-transparent blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-64 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                <Zap className="size-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
                Recruitment Pipelines
              </h1>
            </div>
            <p className="text-slate-400 font-medium text-xs ml-1 tracking-wide">
                ORCHESTRATE YOUR HIRING ECOSYSTEM
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-[240px] pl-11 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-xl focus:ring-primary/50 text-xs font-semibold"
              />
            </div>

            {/* View Mode */}
            <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg transition-all duration-200",
                  viewMode === "list"
                    ? "bg-primary text-white shadow-lg"
                    : "text-slate-500 hover:text-white"
                )}
              >
                <LayoutList className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg transition-all duration-200",
                  viewMode === "kanban"
                    ? "bg-primary text-white shadow-lg"
                    : "text-slate-500 hover:text-white"
                )}
              >
                <Columns3 className="size-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg transition-all duration-200",
                  viewMode === "grid"
                    ? "bg-primary text-white shadow-lg"
                    : "text-slate-500 hover:text-white"
                )}
              >
                <LayoutGrid className="size-4" />
              </button>
            </div>

            {/* Main Actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={handlePipelineSettings}
                    className="h-10 px-4 border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-xs"
                >
                    <Settings2 className="size-4 mr-2" />
                    Configure
                </Button>
                <Button
                    onClick={handleNewPipeline}
                    className="h-10 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 font-bold text-xs transition-all"
                >
                    <Plus className="size-4 mr-2" />
                    New Pipeline
                </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 px-1 shrink-0 custom-scrollbar">
        {recruitments?.map((r: any) => (
          <button
            key={r._id}
            onClick={() => setSelectedRecruitmentId(r._id)}
            className={cn(
              "group relative flex items-center gap-3 whitespace-nowrap rounded-2xl border px-5 py-2.5 text-xs font-bold transition-all duration-300",
              selectedRecruitmentId === r._id
                ? "border-primary/40 bg-primary/5 text-primary shadow-sm"
                : "border-border/40 bg-card/40 text-muted-foreground hover:border-primary/20 hover:text-foreground",
            )}
          >
            {selectedRecruitmentId === r._id && (
                <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-transparent opacity-50 rounded-2xl" />
            )}
            <span className="relative z-10">{r.title}</span>
            <Badge
              className={cn(
                "relative z-10 h-5 min-w-5 justify-center rounded-lg px-1.5 text-[10px] font-bold border-none transition-all",
                selectedRecruitmentId === r._id
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {r.vacancy || 0}
            </Badge>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : !selectedRecruitmentId ? (
          <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
            <div className="size-16 rounded-[1.5rem] bg-muted/20 flex items-center justify-center">
              <Filter className="size-8 text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground font-semibold text-sm">
              Select a pipeline to manage talent
            </p>
          </div>
        ) : (
          <div className="h-full">
            {viewMode === "kanban" && (
                <KanbanBoard 
                    stages={stages || []} 
                    candidates={candidates || []} 
                    search={search}
                    onUpdate={handleRefresh}
                    onEditCandidate={handleEditCandidate}
                    onQuickAdd={handleQuickAdd}
                />
            )}

            {viewMode === "list" && (
              <div className="h-full overflow-y-auto rounded-3xl border border-border/40 bg-background/40 backdrop-blur-xl custom-scrollbar">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-border/40">
                      <TableHead className="font-bold text-xs p-6">Identity</TableHead>
                      <TableHead className="font-bold text-xs">Contact</TableHead>
                      <TableHead className="font-bold text-xs">Phasing Status</TableHead>
                      <TableHead className="font-bold text-xs">Metric</TableHead>
                      <TableHead className="font-bold text-xs">Progress</TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates
                      ?.filter(
                        (c: any) =>
                          c.name.toLowerCase().includes(search.toLowerCase()) ||
                          c.email.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((c: any) => {
                        const stage = stages?.find(
                          (s: any) => s._id === c.stage_id?._id || s._id === c.stage_id
                        );
                        return (
                          <TableRow key={c._id} className="border-border/5 hover:bg-primary/5 transition-colors group">
                            <TableCell className="p-4 px-6 text-sm font-semibold">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-primary/10">
                                  <AvatarFallback className="bg-primary/5 text-primary font-bold text-[10px]">
                                    {getInitials(c.name)}
                                  </AvatarFallback>
                                </Avatar>
                                {c.name}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-xs font-medium">
                              {c.email}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-primary/5 text-primary border border-primary/10 font-bold text-[10px] px-2.5 py-0.5 rounded-lg">
                                {stage?.stage || "UNASSIGNED"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5 font-bold text-xs">
                                {c.rating || 0} <Star className="size-3 text-amber-500 fill-amber-500" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1.5 min-w-[120px]">
                                <div className="flex justify-between text-[8px] font-black text-muted-foreground uppercase">
                                  <span>Path</span>
                                  <span className="text-primary italic">
                                    {stages.findIndex(s => s._id === (c.stage_id?._id || c.stage_id)) + 1} / {stages.length}
                                  </span>
                                </div>
                                <PipelineProgress stages={stages} currentStageId={c.stage_id?._id || c.stage_id} />
                              </div>
                            </TableCell>
                            <TableCell>
                              <ActionMenu
                                items={[
                                  {
                                    label: "Update Profile",
                                    icon: <Pencil className="size-4" />,
                                    onClick: () => handleEditCandidate(c),
                                  },
                                  ...stages
                                    .filter((s: any) => s._id !== (c.stage_id?._id || c.stage_id))
                                    .map((s: any) => ({
                                      label: `Move to ${s.stage}`,
                                      onClick: () => handleStageChange(c, s._id),
                                    })),
                                ]}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            )}

            {viewMode === "grid" && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-y-auto h-full p-2 custom-scrollbar">
                {candidates
                  ?.filter(
                    (c: any) =>
                      c.name.toLowerCase().includes(search.toLowerCase()) ||
                      c.email.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((c: any) => {
                    const stageName = stages?.find(
                      (s: any) => s._id === c.stage_id?._id || s._id === c.stage_id
                    )?.stage || "Unassigned";
                    return (
                      <Card
                        key={c._id}
                        className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 border-border/40 bg-background/40 backdrop-blur-3xl hover:border-primary/30"
                      >
                        <div className={cn(
                            "absolute right-0 top-0 px-3 py-1 text-[9px] font-bold text-white rounded-bl-xl shadow-sm",
                            stageColors[stageName] || "bg-slate-500"
                        )}>
                          {stageName.toUpperCase()}
                        </div>
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <Avatar className="h-16 w-16 border-2 border-primary/10 group-hover:scale-105 transition-transform">
                              <AvatarFallback className="bg-primary/5 text-primary font-bold text-sm">
                                {getInitials(c.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-0.5">
                              <p className="font-bold text-base tracking-tight">{c.name}</p>
                              <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[160px]">
                                {c.email}
                              </p>
                            </div>
                             <div className="pt-4 flex flex-col gap-3 w-full border-t border-border/40">
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex justify-between text-[8px] font-black text-muted-foreground uppercase">
                                        <span>Progress</span>
                                        <span className="text-primary italic">
                                            {stages.findIndex(s => s._id === (c.stage_id?._id || c.stage_id)) + 1} / {stages.length}
                                        </span>
                                    </div>
                                    <PipelineProgress stages={stages} currentStageId={c.stage_id?._id || c.stage_id} />
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <Badge variant="outline" className="h-5 border-primary/20 bg-primary/5 text-primary font-bold text-[9px]">
                                        {c.rating || 0} SCORE
                                    </Badge>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleEditCandidate(c)}
                                        className="h-6 font-bold text-[10px] hover:text-primary p-0"
                                    >
                                        MANAGEMENT
                                    </Button>
                                </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>

      <PipelineManagementDialog 
        open={pipelineManagementOpen}
        onOpenChange={setPipelineManagementOpen}
        onSuccess={onPipelineSuccess}
        initialRecruitmentId={editPipelineId}
      />

      <CreateCandidateDialog
        open={candidateDialogOpen}
        onOpenChange={setCandidateDialogOpen}
        onSuccess={onCandidateSuccess}
        candidate={editingCandidate}
        defaultRecruitmentId={selectedRecruitmentId}
        defaultStageId={quickAddStageId}
      />
    </div>
  );
}

function PipelineProgress({ stages, currentStageId }: { stages: any[]; currentStageId: string }) {
  if (!stages || stages.length === 0) return null;
  
  const sortedStages = [...stages].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
  const currentStageIndex = sortedStages.findIndex(s => s._id === currentStageId);

  return (
    <div className="flex gap-1 h-1 w-full">
      {sortedStages.map((s, idx) => {
        const isCurrent = s._id === currentStageId;
        const isPast = idx < currentStageIndex;
        return (
          <div 
            key={s._id} 
            className={cn(
              "flex-1 rounded-full transition-all duration-500",
              isCurrent ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]" : 
              isPast ? "bg-primary/40" : "bg-muted/40"
            )}
            title={s.stage}
          />
        );
      })}
    </div>
  );
}

function Star(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
