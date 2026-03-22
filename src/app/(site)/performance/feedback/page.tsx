"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

export default function FeedbackPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/pms/feedback")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setItems(d))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Feedback</h1>
        <p className="text-sm text-muted-foreground">
          Performance feedback and reviews
        </p>
      </div>
      <div className="grid gap-3">
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No feedback
            </CardContent>
          </Card>
        ) : (
          items.map((f: any) => (
            <Card key={f._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-950/50">
                    <MessageSquare className="size-5 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {f.employee_id?.employee_first_name}{" "}
                      {f.employee_id?.employee_last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      By {f.manager_id?.employee_first_name}{" "}
                      {f.manager_id?.employee_last_name} • Rating:{" "}
                      {f.rating ? `${f.rating}/5` : "N/A"} •{" "}
                      {f.period_id?.period_name || "No period"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    f.status === "submitted"
                      ? "default"
                      : f.status === "acknowledged"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {f.status}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
