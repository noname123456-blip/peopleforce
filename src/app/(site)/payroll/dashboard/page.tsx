"use client";
import { useEffect, useState } from "react";
import {
  Wallet,
  FileText,
  TrendingUp,
  Users,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PayrollDashboardPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [payslips, setPayslips] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/payroll/contracts")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setContracts(d))
      .catch(() => {});
    fetch("/api/payroll/payslips")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setPayslips(d))
      .catch(() => {});
  }, []);

  const stats = [
    {
      label: "Active Contracts",
      value: contracts.filter((c) => c.status === "active").length,
      icon: FileText,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      label: "Total Contracts",
      value: contracts.length,
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      label: "Payslips Generated",
      value: payslips.length,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/50",
    },
    {
      label: "Pending Payslips",
      value: payslips.filter((p) => p.status === "draft").length,
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Payroll Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of contracts, payslips and compensation
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg",
                    stat.bg,
                  )}
                >
                  <stat.icon className={cn("size-5", stat.color)} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            {contracts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No contracts yet. Create your first contract.
              </p>
            ) : (
              <div className="space-y-3">
                {contracts.slice(0, 5).map((c: any) => (
                  <div
                    key={c._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">{c.contract_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.employee_id?.employee_first_name}{" "}
                        {c.employee_id?.employee_last_name}
                      </p>
                    </div>
                    <Badge
                      variant={c.status === "active" ? "default" : "secondary"}
                    >
                      {c.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Payslips</CardTitle>
          </CardHeader>
          <CardContent>
            {payslips.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No payslips generated yet.
              </p>
            ) : (
              <div className="space-y-3">
                {payslips.slice(0, 5).map((p: any) => (
                  <div
                    key={p._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {p.employee_id?.employee_first_name}{" "}
                        {p.employee_id?.employee_last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Net: ${p.net_pay?.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant={p.status === "paid" ? "default" : "secondary"}
                    >
                      {p.status}
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
