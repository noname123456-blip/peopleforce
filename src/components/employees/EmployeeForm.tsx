"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  BadgeCheck,
  MapPin,
  Save,
  Briefcase,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";

interface EmployeeFormProps {
  onSuccess?: (employee: any) => void;
  onCancel?: () => void;
}

export default function EmployeeForm({ onSuccess, onCancel }: EmployeeFormProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingOptions, setFetchingOptions] = useState(true);
  const [error, setError] = useState("");

  const [departments, setDepartments] = useState<any[]>([]);
  const [jobPositions, setJobPositions] = useState<any[]>([]);

  const [form, setForm] = useState({
    employee_first_name: "",
    employee_last_name: "",
    email: "",
    phone: "",
    badge_id: "",
    gender: "male",
    dob: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    department_id: "",
    job_position_id: "",
    date_joining: new Date().toISOString().split("T")[0],
    qualification: "",
    experience: "",
    marital_status: "single",
    children: "",
    emergency_contact_name: "",
    emergency_contact: "",
    emergency_contact_relation: "",
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [depts, positions] = await Promise.all([
          apiRequest("GET", "/departments"),
          apiRequest("GET", "/job-positions"),
        ]);
        setDepartments(depts.data || []);
        setJobPositions(positions.data || []);
      } catch (err) {
        console.error("Failed to load form options", err);
      } finally {
        setFetchingOptions(false);
      }
    };
    loadOptions();
  }, []);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const promise = apiRequest("POST", "/employees", {
      ...form,
      experience: form.experience ? parseInt(form.experience) : 0,
      children: form.children ? parseInt(form.children) : 0,
    });

    toast.promise(promise, {
      loading: "Creating employee...",
      success: (resp) => {
        if (onSuccess) onSuccess(resp);
        return "Employee created successfully";
      },
      error: (err) => {
        setError(err.message || "Failed to create employee");
        return err.message || "Failed to create employee";
      },
      finally: () => setLoading(false),
    });
  };

  if (fetchingOptions) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium shadow-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 overflow-y-auto max-h-[70vh] px-1">
        {/* Personal Info */}
        <Card className="shadow-none border-border/50">
          <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <User className="size-4 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  First Name *
                </label>
                <Input
                  required
                  value={form.employee_first_name}
                  onChange={set("employee_first_name")}
                  placeholder="John"
                  className="h-9"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Last Name
                </label>
                <Input
                  value={form.employee_last_name}
                  onChange={set("employee_last_name")}
                  placeholder="Doe"
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Gender
                </label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Date of Birth
                </label>
                <Input type="date" value={form.dob} onChange={set("dob")} className="h-9" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/40">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Marital Status
                </label>
                <Select
                  value={form.marital_status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, marital_status: v }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  No. of Children
                </label>
                <Input
                  type="number"
                  min="0"
                  value={form.children}
                  onChange={set("children")}
                  placeholder="0"
                  className="h-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card className="shadow-none border-border/50">
          <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Briefcase className="size-4 text-primary" />
              Work Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Department
                </label>
                <Select
                  value={form.department_id}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, department_id: v }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d._id} value={d._id}>
                        {d.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Job Position
                </label>
                <Select
                  value={form.job_position_id}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, job_position_id: v }))
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select Position" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobPositions
                      .filter(
                        (jp) =>
                          !form.department_id ||
                          (jp.department_id?._id || jp.department_id) ===
                            form.department_id,
                      )
                      .map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.job_position}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Joining Date
                </label>
                <Input
                  type="date"
                  value={form.date_joining}
                  onChange={set("date_joining")}
                  className="h-9"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Badge ID
                </label>
                <Input
                  value={form.badge_id}
                  onChange={set("badge_id")}
                  placeholder="EMP-001"
                  className="h-9"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="size-4 text-muted-foreground" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Background</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Qualification
                  </label>
                  <Input
                    value={form.qualification}
                    onChange={set("qualification")}
                    placeholder="Bachelor's Degree"
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Experience (Years)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={form.experience}
                    onChange={set("experience")}
                    placeholder="0"
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Emergency */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-none border-border/50">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Mail className="size-4 text-primary" />
                Contact Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Email *
                </label>
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={set("email")}
                  placeholder="john@example.com"
                  className="h-9"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Phone
                </label>
                <Input
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+1..."
                  className="h-9"
                />
              </div>
              <div className="pt-2 border-t border-border/40">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3" /> Address
                </label>
                <Input
                  value={form.address}
                  onChange={set("address")}
                  placeholder="Street address"
                  className="h-9 mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={form.city}
                    onChange={set("city")}
                    placeholder="City"
                    className="h-9 text-xs"
                  />
                  <Input
                    value={form.state}
                    onChange={set("state")}
                    placeholder="State"
                    className="h-9 text-xs"
                  />
                  <Input
                    value={form.country}
                    onChange={set("country")}
                    placeholder="Country"
                    className="h-9 text-xs"
                  />
                  <Input
                    value={form.zip}
                    onChange={set("zip")}
                    placeholder="ZIP"
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none border-border/50">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" />
                Emergency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Contact Name
                </label>
                <Input
                  value={form.emergency_contact_name}
                  onChange={set("emergency_contact_name")}
                  placeholder="Name"
                  className="h-9"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Relation
                </label>
                <Input
                  value={form.emergency_contact_relation}
                  onChange={set("emergency_contact_relation")}
                  placeholder="Relation"
                  className="h-9"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Phone
                </label>
                <Input
                  value={form.emergency_contact}
                  onChange={set("emergency_contact")}
                  placeholder="Number"
                  className="h-9"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border/50 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="gap-2 min-w-[120px]"
        >
          <Save className="size-4" />
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </form>
  );
}
