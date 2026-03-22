"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical, Mail, Phone, Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CandidateCardProps {
  candidate: any;
  onEdit: (candidate: any) => void;
  allStages?: any[];
}

export function CandidateCard({ candidate, onEdit, allStages = [] }: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: candidate._id,
    data: {
      type: "candidate",
      candidate,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const initials = candidate.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="group relative"
      >
        <Card className={cn(
          "mb-3 border-border/40 bg-background/60 backdrop-blur-md shadow-sm transition-all hover:shadow-xl hover:border-primary/40 cursor-grab active:cursor-grabbing",
          isDragging && "border-primary/60 ring-2 ring-primary/20 shadow-2xl"
        )}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-inner">
                  <AvatarImage src={candidate.profile} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                    {candidate.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                    <Mail className="size-2.5" />
                    {candidate.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-primary/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(candidate);
                }}
              >
                <MoreVertical className="size-4 text-muted-foreground" />
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-muted/30 border-muted-foreground/20 font-medium">
                <Star className="size-2.5 mr-1 text-amber-500 fill-amber-500" />
                {candidate.rating || 0}
              </Badge>
              {candidate.mobile && (
                <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-muted/30 border-muted-foreground/20 font-medium">
                  <Phone className="size-2.5 mr-1" />
                  Call
                </Badge>
              )}
              {candidate.schedule_date && (
                <Badge variant="outline" className="h-5 px-1.5 text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/20 font-medium">
                  <Calendar className="size-2.5 mr-1" />
                  Interview
                </Badge>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-1.5">
                {/* Visual placeholder for activity or tags */}
                <div className="size-5 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-800" />
                <div className="size-5 rounded-full border-2 border-background bg-slate-300 dark:bg-slate-700" />
              </div>
              <p className="text-[9px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                Active 2h ago
              </p>
            </div>

            {/* Pipeline Progress Visual */}
            {allStages.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border/20">
                <div className="flex items-center justify-between gap-1 mb-1.5 px-0.5">
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Pipeline Path</span>
                  <span className="text-[8px] font-bold text-primary italic">
                    {allStages.findIndex(s => s._id === (candidate.stage_id?._id || candidate.stage_id)) + 1} / {allStages.length}
                  </span>
                </div>
                <div className="flex gap-1 h-1">
                  {allStages.sort((a, b) => (a.sequence || 0) - (b.sequence || 0)).map((s) => {
                    const isCurrent = s._id === (candidate.stage_id?._id || candidate.stage_id);
                    const isPast = (s.sequence || 0) < (allStages.find(as => as._id === (candidate.stage_id?._id || candidate.stage_id))?.sequence || 0);
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
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
