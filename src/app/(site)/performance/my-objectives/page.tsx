"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

export default function MyObjectivesPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/pms/employee-objectives")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setItems(d))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Objectives</h1>
        <p className="text-sm text-muted-foreground">
          Your assigned objectives and OKRs
        </p>
      </div>
      <div className="grid gap-3">
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No objectives assigned
            </CardContent>
          </Card>
        ) : (
          items.map((e: any) => (
            <Card key={e._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
                    <Target className="size-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {e.objective_id?.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Progress: {e.progress_percentage}% •{" "}
                      {e.key_results?.length || 0} Key Results
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    e.status === "Closed"
                      ? "default"
                      : e.status === "On Track"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {e.status}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
