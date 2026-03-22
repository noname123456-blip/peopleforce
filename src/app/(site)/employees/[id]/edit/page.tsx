"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  BadgeCheck,
  Briefcase,
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
import { toast } from "sonner";
import { apiRequest } from "@/utils/api";

interface Form {
  employee_first_name: string;
  employee_last_name: string;
  email: string;
  phone: string;
  badge_id: string;
  gender: string;
  dob: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  marital_status: string;
  qualification: string;
  emergency_contact: string;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  department_id: string;
  job_position_id: string;
  date_joining: string;
}

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Form | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [jobPositions, setJobPositions] = useState<any[]>([]);

  useEffect(() => {
    apiRequest("GET", "/departments").then((res) =>
      setDepartments(res.data || []),
    );
    apiRequest("GET", "/job-positions").then((res) =>
      setJobPositions(res.data || []),
    );

    fetch(`/api/employees/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setForm({
            employee_first_name: data.employee_first_name || "",
            employee_last_name: data.employee_last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            badge_id: data.badge_id || "",
            gender: data.gender || "male",
            dob: data.dob ? data.dob.slice(0, 10) : "",
            address: data.address || "",
            city: data.city || "",
            state: data.state || "",
            country: data.country || "",
            zip: data.zip || "",
            marital_status: data.marital_status || "single",
            qualification: data.qualification || "",
            emergency_contact: data.emergency_contact || "",
            emergency_contact_name: data.emergency_contact_name || "",
            emergency_contact_relation: data.emergency_contact_relation || "",
            department_id:
              data.employee_work_info?.department_id?._id ||
              data.employee_work_info?.department_id ||
              "",
            job_position_id:
              data.employee_work_info?.job_position_id?._id ||
              data.employee_work_info?.job_position_id ||
              "",
            date_joining: data.employee_work_info?.date_joining
              ? data.employee_work_info.date_joining.slice(0, 10)
              : "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setError("");
    setSaving(true);

    const promise = apiRequest("PUT", `/employees/${id}`, form);

    toast.promise(promise, {
      loading: "Updating employee...",
      success: () => {
        router.push(`/employees/${id}`);
        router.refresh();
        return "Employee updated successfully";
      },
      error: (err) => {
        setError(err.message || "Failed to update");
        return err.message || "Failed to update";
      },
      finally: () => setSaving(null as any), // Fix types if needed, or just setSaving(false)
    });

    promise.finally(() => setSaving(false));
  };

  if (loading || !form) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => (f ? { ...f, [key]: e.target.value } : f));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="gap-1.5">
          <Link href={`/employees/${id}`}>
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Employee</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Personal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="size-4 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  First Name *
                </label>
                <Input
                  required
                  value={form.employee_first_name}
                  onChange={set("employee_first_name")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Last Name
                </label>
                <Input
                  value={form.employee_last_name}
                  onChange={set("employee_last_name")}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Gender
                </label>
                <Select
                  value={form.gender}
                  onValueChange={(v) =>
                    setForm((f) => (f ? { ...f, gender: v } : f))
                  }
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
                <label className="mb-1.5 block text-sm font-medium">
                  Date of Birth
                </label>
                <Input type="date" value={form.dob} onChange={set("dob")} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Marital Status
                </label>
                <Select
                  value={form.marital_status}
                  onValueChange={(v) =>
                    setForm((f) => (f ? { ...f, marital_status: v } : f))
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
                <label className="mb-1.5 block text-sm font-medium">
                  Qualification
                </label>
                <Input
                  value={form.qualification}
                  onChange={set("qualification")}
                  placeholder="e.g. Bachelor's in CS"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="size-4 text-primary" />
              Work Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Department
                </label>
                <Select
                  value={form.department_id}
                  onValueChange={(v) =>
                    setForm((f) => (f ? { ...f, department_id: v } : f))
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
                <label className="mb-1.5 block text-sm font-medium">
                  Job Position
                </label>
                <Select
                  value={form.job_position_id}
                  onValueChange={(v) =>
                    setForm((f) => (f ? { ...f, job_position_id: v } : f))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Position" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobPositions.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.job_position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Joining Date
              </label>
              <Input
                type="date"
                value={form.date_joining}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, date_joining: e.target.value } : f,
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="size-4 text-primary" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Email *
              </label>
              <Input
                type="email"
                required
                value={form.email}
                onChange={set("email")}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Phone
                </label>
                <Input value={form.phone} onChange={set("phone")} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Badge ID
                </label>
                <Input value={form.badge_id} onChange={set("badge_id")} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="size-4 text-primary" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Street Address
              </label>
              <Input value={form.address} onChange={set("address")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">City</label>
                <Input value={form.city} onChange={set("city")} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  State
                </label>
                <Input value={form.state} onChange={set("state")} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Country
                </label>
                <Input value={form.country} onChange={set("country")} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  ZIP Code
                </label>
                <Input value={form.zip} onChange={set("zip")} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="size-4 text-amber-500" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Contact Name
                </label>
                <Input
                  value={form.emergency_contact_name}
                  onChange={set("emergency_contact_name")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Contact Number
                </label>
                <Input
                  value={form.emergency_contact}
                  onChange={set("emergency_contact")}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Relationship
              </label>
              <Input
                value={form.emergency_contact_relation}
                onChange={set("emergency_contact_relation")}
                placeholder="e.g. Spouse, Parent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="size-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href={`/employees/${id}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
