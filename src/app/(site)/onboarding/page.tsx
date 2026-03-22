"use client";

import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListChecks,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";
import { useList } from "@/hooks/use-list";
import Link from "next/link";

export default function OnboardingPage() {
  const { data: stages, loading: loadingStages } = useList<any>("/onboarding");
  const { data: tasks, loading: loadingTasks } =
    useList<any>("/onboarding/tasks");
  const { data: candidates, loading: loadingCandidates } =
    useList<any>("/candidates");

  const loading = loadingStages || loadingTasks || loadingCandidates;

  const totalStages = stages.length;
  const totalTasks = tasks.length;
  const totalCandidates = candidates.length;

  const stats = [
    {
      label: "Active Stages",
      value: totalStages,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      label: "Candidates",
      value: totalCandidates,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      label: "Stages with Tasks",
      value: stages.filter((s: any) =>
        tasks.some((t: any) => (t.stage_id?._id || t.stage_id) === s._id),
      ).length,
      icon: AlertTriangle,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-950/50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Onboarding</h1>
          <p className="text-sm text-muted-foreground">
            New hire onboarding overview and progress
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/onboarding/stages">
            <Button variant="outline" size="sm" className="gap-2">
              <ListChecks className="size-3.5" /> Manage Stages
            </Button>
          </Link>
          <Link href="/onboarding/tasks">
            <Button size="sm" className="gap-2">
              <ListChecks className="size-3.5" /> View Tasks
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader variant="dots" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg",
                      s.bg,
                    )}
                  >
                    <s.icon className={cn("size-5", s.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Onboarding Stages &amp; Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stages.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No onboarding stages configured yet.</p>
                  <Link href="/onboarding/stages">
                    <Button variant="outline" size="sm" className="mt-3">
                      Configure Stages
                    </Button>
                  </Link>
                </div>
              ) : (
                stages.map((stage: any) => {
                  const stageTasks = tasks.filter(
                    (t: any) => (t.stage_id?._id || t.stage_id) === stage._id,
                  );
                  const taskCount = stageTasks.length;
                  return (
                    <div
                      key={stage._id}
                      className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/20 p-4 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {stage.sequence || "—"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{stage.stage_title}</p>
                          {stage.is_final_stage && (
                            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 text-[10px]">
                              Final
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {taskCount} task{taskCount !== 1 ? "s" : ""}{" "}
                          configured
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {taskCount} tasks
                      </Badge>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
