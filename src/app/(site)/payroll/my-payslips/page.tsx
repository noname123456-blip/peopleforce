"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export default function MyPayslipsPage() {
  const [payslips, setPayslips] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/payroll/payslips")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setPayslips(d))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Payslips</h1>
        <p className="text-sm text-muted-foreground">
          View your payslip history
        </p>
      </div>
      <div className="grid gap-3">
        {payslips.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No payslips available
            </CardContent>
          </Card>
        ) : (
          payslips.map((p: any) => (
            <Card key={p._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/50">
                    <Wallet className="size-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {new Date(p.start_date).toLocaleDateString()} -{" "}
                      {new Date(p.end_date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Basic: ${p.basic_pay?.toLocaleString()} • Net: $
                      {p.net_pay?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant={p.status === "paid" ? "default" : "secondary"}>
                  {p.status}
                </Badge>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
