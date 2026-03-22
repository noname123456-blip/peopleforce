"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft } from "lucide-react";

export default function AssignmentsPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/assets/assignments")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setItems(d))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Asset Assignments</h1>
        <p className="text-sm text-muted-foreground">Track asset allocations</p>
      </div>
      <div className="grid gap-3">
        {items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No assignments
            </CardContent>
          </Card>
        ) : (
          items.map((a: any) => (
            <Card key={a._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-950/50">
                    <ArrowRightLeft className="size-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {a.asset_id?.asset_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      → {a.assigned_to_employee_id?.employee_first_name}{" "}
                      {a.assigned_to_employee_id?.employee_last_name} •{" "}
                      {new Date(a.assigned_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    a.status === "assigned"
                      ? "default"
                      : a.status === "returned"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {a.status}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
