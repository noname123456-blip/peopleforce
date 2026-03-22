"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Plus } from "lucide-react";
import RequestAssetDialog from "@/components/assets/RequestAssetDialog";
import { Button } from "@/components/ui/button";

export default function MyAssetsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/assets/assignments")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setAssignments(d))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Assets</h1>
        <p className="text-sm text-muted-foreground">Assets assigned to you</p>
      </div>
      <div className="flex items-center justify-between">
        <div></div>
        <RequestAssetDialog onSuccess={() => {
          fetch("/api/assets/assignments")
            .then((r) => r.json())
            .then((d) => Array.isArray(d) && setAssignments(d));
        }} />
      </div>
      <div className="grid gap-3">
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No assets assigned
            </CardContent>
          </Card>
        ) : (
          assignments.map((a: any) => (
            <Card key={a._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
                    <Package className="size-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {a.asset_id?.asset_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Assigned: {new Date(a.assigned_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge>{a.status}</Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
