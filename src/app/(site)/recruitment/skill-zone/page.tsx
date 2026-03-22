"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Award,
  Users,
  TrendingUp,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { Loader } from "@/components/ui/loader";
import { SkillZoneDialog } from "@/components/recruitment/SkillZoneDialog";

interface SkillZone {
  id: string;
  title: string;
  description: string;
  candidates: { id: string; name: string; avatar: string; rating: number }[];
  requiredSkills: string[];
  level: "Junior" | "Mid" | "Senior" | "Lead";
}

export default function SkillZonePage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<any>(null);

  const {
    data: skillZones = [],
    loading,
    refetch,
  } = useList<any>("/skill-zones");
  const { delete: deleteZone } = useDelete("/skill-zones");

  const filtered = skillZones.filter(
    (s: any) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.description &&
        s.description.toLowerCase().includes(search.toLowerCase())),
  );

  const totalCandidates = skillZones.reduce(
    (sum: number, s: any) => sum + (s.candidates?.length || 0),
    0,
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this skill zone?")) {
      const success = await deleteZone(id);
      if (success) refetch();
    }
  };

  const handleEdit = (zone: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingZone(zone);
    setDialogOpen(true);
  };

  const levelColors: Record<string, string> = {
    Junior:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    Mid: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    Senior:
      "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
    Lead: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skill Zone</h1>
          <p className="text-sm text-muted-foreground">
            Manage skill-based candidate pools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search zones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-[200px] pl-9"
            />
          </div>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => {
              setEditingZone(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="size-3.5" />
            Add Zone
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
              <Award className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{skillZones.length}</p>
              <p className="text-xs text-muted-foreground">Skill Zones</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
              <Users className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCandidates}</p>
              <p className="text-xs text-muted-foreground">Total Candidates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/50">
              <TrendingUp className="size-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {(
                  ((totalCandidates / Math.max(skillZones.length, 1)) * 100) /
                  100
                ).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">Avg per Zone</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Zone Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <Loader />
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full border-2 border-dashed border-border/50 rounded-lg p-10 text-center text-muted-foreground">
            No skill zones found. Add a zone to get started!
          </div>
        ) : (
          filtered.map((zone: any) => (
            <Card
              key={zone._id}
              className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/20"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{zone.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {zone.description}
                    </p>
                  </div>
                  <Badge className={cn("text-[10px]", levelColors[zone.level])}>
                    {zone.level}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {zone.requiredSkills?.map((skill: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-[10px] font-normal"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Candidates</span>
                    <span className="font-medium text-foreground">
                      {zone.candidates?.length || 0}
                    </span>
                  </div>
                  <Progress
                    value={
                      zone.candidates?.length > 0
                        ? Math.min((zone.candidates.length / 5) * 100, 100)
                        : 0
                    }
                    className="h-1.5"
                  />
                </div>

                {zone.candidates?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {zone.candidates.slice(0, 3).map((c: any) => (
                      <div key={c.id} className="flex items-center gap-2">
                        <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                          {c.avatar}
                        </div>
                        <span className="flex-1 truncate text-xs">
                          {c.name}
                        </span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className={cn(
                                "size-2.5",
                                i <= c.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/20",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    {zone.candidates.length > 3 && (
                      <p className="text-[10px] text-muted-foreground">
                        +{zone.candidates.length - 3} more
                      </p>
                    )}
                  </div>
                )}

                {(!zone.candidates || zone.candidates.length === 0) && (
                  <div className="mt-4 rounded-lg border-2 border-dashed border-border/50 p-4 text-center text-xs text-muted-foreground">
                    No candidates yet
                  </div>
                )}

                <div className="mt-4 flex gap-2 border-t border-border/50 pt-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 text-xs"
                  >
                    <Eye className="size-3" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={(e) => handleEdit(zone, e)}
                  >
                    <Edit2 className="size-3.5 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={(e) => handleDelete(zone._id, e)}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <SkillZoneDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        skillZone={editingZone}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
