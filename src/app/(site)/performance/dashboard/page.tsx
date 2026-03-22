"use client";
import { useEffect, useState } from "react";
import { Target, TrendingUp, Users, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function PerformanceDashboardPage() {
  const [objectives, setObjectives] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/pms/objectives")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setObjectives(d))
      .catch(() => {});
    fetch("/api/pms/feedback")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setFeedback(d))
      .catch(() => {});
  }, []);

  const stats = [
    {
      label: "Total Objectives",
      value: objectives.length,
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      label: "Active OKRs",
      value: objectives.filter((o) => o.assignees?.length > 0).length,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: "Feedback Given",
      value: feedback.filter((f) => f.status === "submitted").length,
      icon: BarChart3,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/50",
    },
    {
      label: "Draft Feedback",
      value: feedback.filter((f) => f.status === "draft").length,
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Performance Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          OKRs, objectives, and feedback overview
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-lg",
                  s.bg,
                )}
              >
                <s.icon className={cn("size-5", s.color)} />
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Objectives</CardTitle>
          </CardHeader>
          <CardContent>
            {objectives.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No objectives
              </p>
            ) : (
              <div className="space-y-3">
                {objectives.slice(0, 5).map((o: any) => (
                  <div
                    key={o._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{o.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.assignees?.length || 0} assignees •{" "}
                        {o.key_result_ids?.length || 0} key results
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {feedback.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No feedback
              </p>
            ) : (
              <div className="space-y-3">
                {feedback.slice(0, 5).map((f: any) => (
                  <div
                    key={f._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {f.employee_id?.employee_first_name}{" "}
                        {f.employee_id?.employee_last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        By {f.manager_id?.employee_first_name} • Rating:{" "}
                        {f.rating || "N/A"}
                      </p>
                    </div>
                    <Badge
                      variant={
                        f.status === "submitted" ? "default" : "secondary"
                      }
                    >
                      {f.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
