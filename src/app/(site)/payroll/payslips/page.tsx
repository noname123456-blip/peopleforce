"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Wallet, Trash2 } from "lucide-react";

export default function PayslipsPage() {
  const [payslips, setPayslips] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({
    employee_id: "",
    start_date: "",
    end_date: "",
    basic_pay: 0,
    gross_pay: 0,
    net_pay: 0,
    total_deductions: 0,
    total_allowances: 0,
    status: "draft",
  });

  useEffect(() => {
    fetch("/api/payroll/payslips")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setPayslips(d))
      .catch(() => {});
    fetch("/api/employees")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setEmployees(d))
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/payroll/payslips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const p = await res.json();
      setPayslips((prev) => [p, ...prev]);
      setOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this payslip?")) return;
    await fetch(`/api/payroll/payslips/${id}`, { method: "DELETE" });
    setPayslips((prev) => prev.filter((p) => p._id !== id));
  };

  const filtered = payslips.filter((p) =>
    p.employee_id?.employee_first_name
      ?.toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payslips</h1>
          <p className="text-sm text-muted-foreground">
            Manage employee payslips
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" /> Generate Payslip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Generate Payslip</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Employee</Label>
                <Select
                  value={form.employee_id}
                  onValueChange={(v) => setForm({ ...form, employee_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((e: any) => (
                      <SelectItem key={e._id} value={e._id}>
                        {e.employee_first_name} {e.employee_last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={(e) =>
                      setForm({ ...form, start_date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) =>
                      setForm({ ...form, end_date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Basic Pay</Label>
                  <Input
                    type="number"
                    value={form.basic_pay}
                    onChange={(e) =>
                      setForm({ ...form, basic_pay: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Gross Pay</Label>
                  <Input
                    type="number"
                    value={form.gross_pay}
                    onChange={(e) =>
                      setForm({ ...form, gross_pay: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Deductions</Label>
                  <Input
                    type="number"
                    value={form.total_deductions}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        total_deductions: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Net Pay</Label>
                  <Input
                    type="number"
                    value={form.net_pay}
                    onChange={(e) =>
                      setForm({ ...form, net_pay: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review_ongoing">
                      Review Ongoing
                    </SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Generate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No payslips found
            </CardContent>
          </Card>
        ) : (
          filtered.map((p: any) => (
            <Card key={p._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/50">
                    <Wallet className="size-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {p.employee_id?.employee_first_name}{" "}
                      {p.employee_id?.employee_last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Net: ${p.net_pay?.toLocaleString()} •{" "}
                      {new Date(p.start_date).toLocaleDateString()} -{" "}
                      {new Date(p.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={p.status === "paid" ? "default" : "secondary"}
                  >
                    {p.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(p._id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
