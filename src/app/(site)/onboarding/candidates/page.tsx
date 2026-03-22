"use client";

import { useState } from "react";
import { Search, Filter, Eye, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { useList } from "@/hooks/use-list";
import { useDelete } from "@/hooks/use-delete";
import { CreateCandidateDialog } from "@/components/recruitment/CreateCandidateDialog";

const stageColors: Record<string, string> = {
  Initial: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Screening:
    "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  Interview:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  Hired:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
};

export default function OnboardingCandidatesPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);

  const {
    data: candidates,
    loading,
    refetch,
  } = useList<any>("/candidates", {
    initialFilters: { start_onboard: "true" },
  });
  const { delete: deleteCandidate } = useDelete("/candidates");

  const filtered = candidates.filter(
    (c: any) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this candidate?")) {
      const success = await deleteCandidate(id);
      if (success) refetch();
    }
  };

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Onboarding Candidates
          </h1>
          <p className="text-sm text-muted-foreground">
            View candidates going through the onboarding process
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-[200px] pl-9"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="size-3.5" />
            Filter
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>No candidates found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c: any) => {
            const stageName = c.stage_id?.stage || "Initial";
            return (
              <Card
                key={c._id}
                className="group transition-all hover:shadow-lg hover:border-primary/20"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {getInitials(c.name || "?")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{c.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => {
                          setEditingCandidate(c);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil className="size-3.5 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => handleDelete(c._id)}
                      >
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {c.mobile || "No phone"} ·{" "}
                        {c.recruitment_id?.title || "General"}
                      </span>
                      <Badge
                        className={cn(
                          "text-[10px]",
                          stageColors[stageName] || "bg-gray-100 text-gray-700",
                        )}
                      >
                        {stageName}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CreateCandidateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
