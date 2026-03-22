"use client";
import { useEffect, useState } from "react";
import { Package, Plus, Search, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AssetsDashboardPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/assets")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setAssets(d))
      .catch(() => {});
    fetch("/api/assets/assignments")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setAssignments(d))
      .catch(() => {});
    fetch("/api/assets/requests")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setRequests(d))
      .catch(() => {});
  }, []);

  const stats = [
    {
      label: "Total Assets",
      value: assets.length,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      label: "Available",
      value: assets.filter((a) => a.asset_status === "Available").length,
      icon: Package,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: "In Use",
      value: assets.filter((a) => a.asset_status === "In use").length,
      icon: Package,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      label: "Pending Requests",
      value: requests.filter((r) => r.status === "requested").length,
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assets Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of company assets
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
            <CardTitle className="text-base">Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No assignments
              </p>
            ) : (
              <div className="space-y-3">
                {assignments.slice(0, 5).map((a: any) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {a.asset_id?.asset_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        → {a.assigned_to_employee_id?.employee_first_name}{" "}
                        {a.assigned_to_employee_id?.employee_last_name}
                      </p>
                    </div>
                    <Badge
                      variant={
                        a.status === "assigned" ? "default" : "secondary"
                      }
                    >
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {requests.filter((r) => r.status === "requested").length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No pending requests
              </p>
            ) : (
              <div className="space-y-3">
                {requests
                  .filter((r) => r.status === "requested")
                  .slice(0, 5)
                  .map((r: any) => (
                    <div
                      key={r._id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {r.employee_id?.employee_first_name}{" "}
                          {r.employee_id?.employee_last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.asset_category_id?.asset_category_name}
                        </p>
                      </div>
                      <Badge variant="outline">{r.status}</Badge>
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
