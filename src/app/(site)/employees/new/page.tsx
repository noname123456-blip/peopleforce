"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
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

export default function NewEmployeePage() {
  const router = useRouter();
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

    // Additional fields requested to make form fully functional
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
      experience: form.experience ? parseInt(form.experience) : null,
      children: form.children ? parseInt(form.children) : null,
    });

    toast.promise(promise, {
      loading: "Creating employee...",
      success: (resp) => {
        router.push(`/employees/${resp._id || ""}`);
        router.refresh();
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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-1.5 border border-border/50 bg-background hover:bg-muted/50 shadow-sm"
        >
          <Link href="/employees">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">New Employee</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium shadow-sm">
            {error}
          </div>
        )}

        {/* Top Grid for Personal & Work Info side by side */}
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Personal Info */}
          <Card className="shadow-sm border-border/50 flex flex-col">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="size-5 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    First Name *
                  </label>
                  <Input
                    required
                    value={form.employee_first_name}
                    onChange={set("employee_first_name")}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Last Name
                  </label>
                  <Input
                    value={form.employee_last_name}
                    onChange={set("employee_last_name")}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Gender
                  </label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                  >
                    <SelectTrigger>
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
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Date of Birth
                  </label>
                  <Input type="date" value={form.dob} onChange={set("dob")} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/50">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Marital Status
                  </label>
                  <Select
                    value={form.marital_status}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, marital_status: v }))
                    }
                  >
                    <SelectTrigger>
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
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    No. of Children
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={form.children}
                    onChange={set("children")}
                    placeholder="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Information */}
          <Card className="shadow-sm border-border/50 flex flex-col">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="size-5 text-primary" />
                Work Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Department
                  </label>
                  <Select
                    value={form.department_id}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, department_id: v }))
                    }
                  >
                    <SelectTrigger>
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
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Job Position
                  </label>
                  <Select
                    value={form.job_position_id}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, job_position_id: v }))
                    }
                  >
                    <SelectTrigger>
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
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Joining Date
                  </label>
                  <Input
                    type="date"
                    value={form.date_joining}
                    onChange={set("date_joining")}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Badge ID
                  </label>
                  <Input
                    value={form.badge_id}
                    onChange={set("badge_id")}
                    placeholder="EMP-001"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-border/50 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Background</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Qualification
                    </label>
                    <Input
                      value={form.qualification}
                      onChange={set("qualification")}
                      placeholder="Bachelor's of Science"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Experience (Years)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={form.experience}
                      onChange={set("experience")}
                      placeholder="5"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact and Emergency grid */}
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* Contact Details */}
          <Card className="shadow-sm border-border/50 flex flex-col">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <Mail className="size-5 text-primary" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 pt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email *
                  </label>
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={set("email")}
                    placeholder="john@company.com"
                  />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone
                  </label>
                  <Input
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+1 (234) 567-8900"
                  />
                </div>
              </div>
              <div className="pt-3 border-t border-border/50 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Full Address</span>
                </div>
                <div>
                  <Input
                    value={form.address}
                    onChange={set("address")}
                    placeholder="123 Main St, Apt 4B"
                    className="mb-4"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Input
                      value={form.city}
                      onChange={set("city")}
                      placeholder="City"
                      className="col-span-1"
                    />
                    <Input
                      value={form.state}
                      onChange={set("state")}
                      placeholder="State"
                      className="col-span-1"
                    />
                    <Input
                      value={form.country}
                      onChange={set("country")}
                      placeholder="Country"
                      className="col-span-1"
                    />
                    <Input
                      value={form.zip}
                      onChange={set("zip")}
                      placeholder="ZIP"
                      className="col-span-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="shadow-sm border-border/50 flex flex-col">
            <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-500" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Emergency Contact Name
                  </label>
                  <Input
                    value={form.emergency_contact_name}
                    onChange={set("emergency_contact_name")}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Relation
                    </label>
                    <Input
                      value={form.emergency_contact_relation}
                      onChange={set("emergency_contact_relation")}
                      placeholder="Spouse, Sibling, etc."
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Contact Number
                    </label>
                    <Input
                      value={form.emergency_contact}
                      onChange={set("emergency_contact")}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions - Sticky Footer effect */}
        <div className="flex gap-3 pt-6 border-t border-border/50 pb-10 justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            asChild
            className="px-8 shadow-sm"
          >
            <Link href="/employees">Cancel</Link>
          </Button>
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="gap-2 px-8 shadow-md hover:shadow-lg transition-shadow"
          >
            <Save className="size-4" />
            {loading ? "Creating..." : "Save Employee Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
