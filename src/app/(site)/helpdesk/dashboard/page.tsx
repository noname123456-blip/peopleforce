"use client";
import { useEffect, useState } from "react";
import { Headset, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function HelpdeskDashboardPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/helpdesk/tickets")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setTickets(d))
      .catch(() => {});
  }, []);

  const stats = [
    {
      label: "Total Tickets",
      value: tickets.length,
      icon: Headset,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      label: "Open",
      value: tickets.filter(
        (t) => t.status === "new" || t.status === "in_progress",
      ).length,
      icon: AlertCircle,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      label: "On Hold",
      value: tickets.filter((t) => t.status === "on_hold").length,
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/50",
    },
    {
      label: "Resolved",
      value: tickets.filter((t) => t.status === "resolved").length,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Helpdesk Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of support tickets
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No tickets yet
            </p>
          ) : (
            <div className="space-y-3">
              {tickets.slice(0, 8).map((t: any) => (
                <div
                  key={t._id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.employee_id?.employee_first_name}{" "}
                      {t.employee_id?.employee_last_name} •{" "}
                      {t.ticket_type?.title || "General"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        t.priority === "critical"
                          ? "destructive"
                          : t.priority === "high"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {t.priority}
                    </Badge>
                    <Badge variant="outline">
                      {t.status?.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
