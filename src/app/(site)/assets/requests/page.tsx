"use client";

import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RequestAssetDialog from "@/components/assets/RequestAssetDialog";

export default function AssetRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ asset_category_id: "", description: "" });

  useEffect(() => {
    fetch("/api/assets/requests")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setRequests(d))
      .catch(() => {});
    fetch("/api/assets/categories")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setCategories(d))
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/assets/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const r = await res.json();
      setRequests((prev) => [r, ...prev]);
      setOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Asset Requests</h1>
          <p className="text-sm text-muted-foreground">
            Request and manage asset requests
          </p>
        </div>
        <RequestAssetDialog onSuccess={() => {
          fetch("/api/assets/requests")
            .then((r) => r.json())
            .then((d) => Array.isArray(d) && setRequests(d));
        }} />
      </div>
      <div className="grid gap-3">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No requests
            </CardContent>
          </Card>
        ) : (
          requests.map((r: any) => (
            <Card key={r._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/50">
                    <Package className="size-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {r.employee_id?.employee_first_name}{" "}
                      {r.employee_id?.employee_last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.asset_category_id?.asset_category_name} •{" "}
                      {r.description}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    r.status === "approved"
                      ? "default"
                      : r.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                >
                  {r.status}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
