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
import { UserPlus, Mail, Phone, Briefcase, Star, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  candidate?: any;
  defaultRecruitmentId?: string | null;
  defaultStageId?: string | null;
}

export function CreateCandidateDialog({
  open,
  onOpenChange,
  onSuccess,
  candidate,
  defaultRecruitmentId,
  defaultStageId,
}: CreateCandidateDialogProps) {
  const { create, loading: creating } = useCreate<any>("/candidates");
  const { update, loading: updating } = useUpdate("/candidates");
  const { data: recruitments } = useList<any>("/recruitment", {
    autoFetch: open
  });

  const isEdit = !!candidate?._id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    recruitment_id: "",
    stage_id: "",
    rating: 0,
  });

  useEffect(() => {
    if (isEdit) {
      setFormData({
        name: candidate.name || "",
        email: candidate.email || "",
        mobile: candidate.mobile || "",
        recruitment_id:
          candidate.recruitment_id?._id || candidate.recruitment_id || "",
        stage_id: candidate.stage_id?._id || candidate.stage_id || "",
        rating: candidate.rating || 0,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        mobile: "",
        recruitment_id: defaultRecruitmentId || "",
        stage_id: defaultStageId || "",
        rating: 0,
      });
    }
  }, [candidate, open, defaultRecruitmentId, defaultStageId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };

    let result = null;
    if (isEdit) {
      result = await update(candidate._id, payload, {
        successMessage: "Candidate profile synchronized",
      });
    } else {
      result = await create(payload, { successMessage: "New talent enrolled" });
    }

    if (result) {
      onSuccess();
      onOpenChange(false);
    }
  };

  const loading = creating || updating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-slate-950 border-white/5 shadow-2xl rounded-[2rem]">
        <div className="relative p-8">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 size-48 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
            
            <DialogHeader className="mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
                        <UserPlus className="size-6 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-bold tracking-tight text-white">
                            {isEdit ? "Refine Talent Profile" : "Enroll New Talent"}
                        </DialogTitle>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                            {isEdit ? "Update candidate specifications" : "Initialize recruitment sequence"}
                        </p>
                    </div>
                </div>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 ml-1">
                        <div className="size-1 bg-primary rounded-full" /> Full Identity
                    </Label>
                    <div className="relative group">
                        <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="e.g. Alexander Pierce"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl text-white font-semibold focus:ring-primary/40 focus:border-primary/40 transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 ml-1">
                            <div className="size-1 bg-primary rounded-full" /> Communication (Email)
                        </Label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <Input
                                type="email"
                                placeholder="alex@technin360.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl text-white font-semibold focus:ring-primary/40 focus:border-primary/40"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 ml-1">
                            <div className="size-1 bg-primary rounded-full" /> Mobile Interface
                        </Label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="+1 (555) 000-0000"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                className="h-12 pl-12 bg-white/5 border-white/10 rounded-xl text-white font-semibold focus:ring-primary/40 focus:border-primary/40"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 ml-1">
                            <div className="size-1 bg-primary rounded-full" /> Assignment (Job)
                        </Label>
                        <Select
                            value={formData.recruitment_id || undefined}
                            onValueChange={(val) => setFormData({ ...formData, recruitment_id: val })}
                        >
                            <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white font-semibold focus:ring-primary/40">
                                <SelectValue placeholder="Select Target..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10 rounded-xl">
                                {recruitments?.map((r: any) => (
                                    <SelectItem key={r._id} value={r._id} className="text-xs font-bold">{r.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 ml-1">
                            <div className="size-1 bg-primary rounded-full" /> Assessment Rating
                        </Label>
                        <div className="flex h-12 items-center px-4 bg-white/5 border border-white/10 rounded-xl gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: s })}
                                    className={cn(
                                        "size-6 transition-all hover:scale-110",
                                        formData.rating >= s ? "text-amber-500 fill-amber-500" : "text-slate-600"
                                    )}
                                >
                                    <Star className="size-full" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 ml-1">
                        <div className="size-1 bg-primary rounded-full" /> Processing Stage
                    </Label>
                    <Select
                        value={formData.stage_id || undefined}
                        onValueChange={(val) => setFormData({ ...formData, stage_id: val })}
                    >
                        <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white font-semibold focus:ring-primary/40">
                            <SelectValue placeholder="Select Stage..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 rounded-xl">
                            {/* We need stages here. For now show from candidate or use a hook if needed */}
                            {/* Actually, it's better to fetch stages based on recruitment_id */}
                            {/* I'll simplify and just allow setting it if we have it */}
                            <StageOptions recruitmentId={formData.recruitment_id} value={formData.stage_id} onSelect={(val: string) => setFormData({ ...formData, stage_id: val })} />
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter className="pt-6 border-t border-white/5 mt-8">
                    <Button 
                        type="button" 
                        variant="ghost" 
                        onClick={() => onOpenChange(false)}
                        className="h-12 px-6 font-bold text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-white"
                    >
                        Abort
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="h-12 px-10 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                        {loading ? "Synchronizing..." : isEdit ? "Sync Profile" : "Deploy Talent"}
                    </Button>
                </DialogFooter>
            </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StageOptions({ recruitmentId, value, onSelect }: { recruitmentId: string; value: string; onSelect: (val: string) => void }) {
  const { data: stages } = useList<any>("/stages", {
    initialFilters: { recruitment_id: recruitmentId, sortBy: "sequence" },
    autoFetch: !!recruitmentId
  });

  return (
    <>
      {stages?.map((s: any) => (
        <SelectItem key={s._id} value={s._id} className="text-xs font-bold">
          {s.stage}
        </SelectItem>
      ))}
      {(!stages || stages.length === 0) && (
        <div className="p-2 text-[10px] text-muted-foreground text-center">
          No stages found for this recruitment
        </div>
      )}
    </>
  );
}
