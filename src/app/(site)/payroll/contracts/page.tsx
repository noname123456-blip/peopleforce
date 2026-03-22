"use client";
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  FileText,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
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

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({
    contract_name: "",
    employee_id: "",
    contract_start_date: "",
    contract_end_date: "",
    wage: 0,
    wage_type: "salary",
    pay_frequency: "monthly",
    status: "draft",
  });

  useEffect(() => {
    fetch("/api/payroll/contracts")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setContracts(d))
      .catch(() => {});
    fetch("/api/employees")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setEmployees(d))
      .catch(() => {});
  }, []);

  const handleCreate = async () => {
    const res = await fetch("/api/payroll/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const c = await res.json();
      setContracts((prev) => [c, ...prev]);
      setOpen(false);
      setForm({
        contract_name: "",
        employee_id: "",
        contract_start_date: "",
        contract_end_date: "",
        wage: 0,
        wage_type: "salary",
        pay_frequency: "monthly",
        status: "draft",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contract?")) return;
    const res = await fetch(`/api/payroll/contracts/${id}`, {
      method: "DELETE",
    });
    if (res.ok) setContracts((prev) => prev.filter((c) => c._id !== id));
  };

  const filtered = contracts.filter(
    (c) =>
      c.contract_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.employee_id?.employee_first_name
        ?.toLowerCase()
        .includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
          <p className="text-sm text-muted-foreground">
            Manage employee contracts
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" /> New Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Contract</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Contract Name</Label>
                <Input
                  value={form.contract_name}
                  onChange={(e) =>
                    setForm({ ...form, contract_name: e.target.value })
                  }
                />
              </div>
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
                    value={form.contract_start_date}
                    onChange={(e) =>
                      setForm({ ...form, contract_start_date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={form.contract_end_date}
                    onChange={(e) =>
                      setForm({ ...form, contract_end_date: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Wage</Label>
                  <Input
                    type="number"
                    value={form.wage}
                    onChange={(e) =>
                      setForm({ ...form, wage: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Wage Type</Label>
                  <Select
                    value={form.wage_type}
                    onValueChange={(v) => setForm({ ...form, wage_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="commission">Commission</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Pay Frequency</Label>
                  <Select
                    value={form.pay_frequency}
                    onValueChange={(v) =>
                      setForm({ ...form, pay_frequency: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Biweekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="semi_monthly">Semi-Monthly</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate}>Create Contract</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search contracts..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-3">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No contracts found
            </CardContent>
          </Card>
        ) : (
          filtered.map((c: any) => (
            <Card key={c._id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
                    <FileText className="size-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.contract_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.employee_id?.employee_first_name}{" "}
                      {c.employee_id?.employee_last_name} • {c.wage_type} • $
                      {c.wage?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      c.status === "active"
                        ? "default"
                        : c.status === "draft"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {c.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(c._id)}
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
