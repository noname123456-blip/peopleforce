"use client";
// No changes needed here if already viewable, but let's check the profile page

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  BadgeCheck,
  Calendar,
  MapPin,
  User,
  Briefcase,
  AlertTriangle,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EmployeeDetail {
  _id: string;
  employee_first_name: string;
  employee_last_name?: string;
  email: string;
  phone?: string;
  badge_id?: string;
  is_active?: boolean;
  gender?: string;
  dob?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  qualification?: string;
  experience?: number;
  marital_status?: string;
  children?: number;
  emergency_contact?: string;
  emergency_contact_name?: string;
  emergency_contact_relation?: string;
  employee_work_info?: {
    department_id?: string;
    job_position_id?: string;
    reporting_manager_id?: string;
    date_joining?: string;
    basic_salary?: number;
    location?: string;
    company_id?: string;
  } | null;
}

type Tab = "personal" | "work" | "contact";

function getInitials(first: string, last?: string) {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase();
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    fetch(`/api/employees/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then(setEmployee)
      .finally(() => setLoading(false));
  }, [id]);

  const handleArchive = async () => {
    if (
      !confirm(
        "Are you sure you want to archive this employee? This action can be reversed.",
      )
    )
      return;
    setArchiving(true);
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/employees");
      }
    } finally {
      setArchiving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading employee...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <AlertTriangle className="size-7 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">Employee not found.</p>
        <Button asChild variant="outline">
          <Link href="/employees">Back to employees</Link>
        </Button>
      </div>
    );
  }

  const fullName =
    `${employee.employee_first_name} ${employee.employee_last_name || ""}`.trim();
  const initials = getInitials(
    employee.employee_first_name,
    employee.employee_last_name,
  );
  const isActive = employee.is_active !== false;

  const tabs: { key: Tab; label: string }[] = [
    { key: "personal", label: "Personal Information" },
    { key: "work", label: "Work Position" },
    { key: "contact", label: "Emergency Contact" },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="gap-1.5 border border-border/40 bg-background/50 backdrop-blur-sm hover:bg-muted/50"
        >
          <Link href="/employees">
            <ArrowLeft className="size-4 text-primary" />
            Back to List
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="gap-1.5 bg-background/50 backdrop-blur-sm shadow-sm"
          >
            <Link href={`/employees/${id}/edit`}>
              <Pencil className="size-3.5" />
              Edit Profile
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-destructive border-destructive/20 bg-destructive/5 hover:bg-destructive/10 backdrop-blur-sm"
            onClick={handleArchive}
            disabled={archiving}
          >
            <Trash2 className="size-3.5" />
            {archiving ? "Archiving..." : "Archive"}
          </Button>
        </div>
      </div>

      {/* Profile hero card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl dark:from-slate-950 dark:via-slate-950 dark:to-primary/5">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 size-64 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="relative group">
            <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex size-32 items-center justify-center rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-foreground/30 text-white text-4xl font-black shadow-2xl border-4 border-white/10">
              {initials}
            </div>
            <div className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border-2 border-primary shadow-lg">
              <BadgeCheck className="size-5 text-primary" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
                {fullName}
              </h1>
              <Badge
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30",
                )}
              >
                {isActive ? "Currently Active" : "Archived"}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-300">
              <div className="flex items-center gap-2 group transition-colors hover:text-white">
                <div className="size-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                  <Mail className="size-4" />
                </div>
                <span className="text-sm font-medium">{employee.email}</span>
              </div>
              {employee.phone && (
                <div className="flex items-center gap-2 group transition-colors hover:text-white">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                    <Phone className="size-4" />
                  </div>
                  <span className="text-sm font-medium">{employee.phone}</span>
                </div>
              )}
              {employee.badge_id && (
                <div className="flex items-center gap-2 group transition-colors hover:text-white">
                  <div className="size-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                    <BadgeCheck className="size-4" />
                  </div>
                  <span className="text-sm font-medium">
                    ID: {employee.badge_id}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center md:justify-start">
        <div className="flex gap-2 rounded-2xl bg-slate-900/40 p-1.5 border border-white/5 backdrop-blur-md">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-xl px-6 py-2.5 text-sm font-bold transition-all duration-300",
                activeTab === tab.key
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                  : "text-slate-400 hover:text-white hover:bg-white/5",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content area */}
      <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "personal" && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card overflow-hidden border-white/10 shadow-lg">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  Identity Details
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-white/5 pt-4">
                <InfoRow icon={User} label="Full Name" value={fullName} />
                <InfoRow
                  icon={User}
                  label="Gender"
                  value={
                    employee.gender
                      ? employee.gender.charAt(0).toUpperCase() +
                        employee.gender.slice(1)
                      : null
                  }
                />
                <InfoRow
                  icon={Calendar}
                  label="Birth Date"
                  value={
                    employee.dob
                      ? new Date(employee.dob).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : null
                  }
                />
                <InfoRow
                  icon={User}
                  label="Marital Status"
                  value={
                    employee.marital_status
                      ? employee.marital_status.charAt(0).toUpperCase() +
                        employee.marital_status.slice(1)
                      : null
                  }
                />
                <InfoRow
                  icon={User}
                  label="Education"
                  value={employee.qualification}
                />
              </CardContent>
            </Card>

            <Card className="glass-card overflow-hidden border-white/10 shadow-lg">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  Residence & Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-white/5 pt-4">
                <InfoRow
                  icon={MapPin}
                  label="Street Address"
                  value={employee.address}
                />
                <InfoRow icon={Building2} label="City" value={employee.city} />
                <InfoRow
                  icon={Building2}
                  label="State / Province"
                  value={employee.state}
                />
                <InfoRow
                  icon={Building2}
                  label="Country"
                  value={employee.country}
                />
                <InfoRow
                  icon={MapPin}
                  label="ZIP / Postal"
                  value={employee.zip}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "work" && (
          <Card className="glass-card overflow-hidden border-white/10 shadow-lg">
            <CardHeader className="bg-white/5 border-b border-white/5">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="size-4 text-primary" />
                Organizational Placement
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {employee.employee_work_info ? (
                <div className="grid gap-0 divide-y divide-white/5 md:grid-cols-2 md:divide-y-0 md:gap-8">
                  <div className="divide-y divide-white/5">
                    <InfoRow
                      icon={Building2}
                      label="Department"
                      value={
                        (employee.employee_work_info.department_id as any)
                          ?.department || "Not Assigned"
                      }
                    />
                    <InfoRow
                      icon={Briefcase}
                      label="Job Position"
                      value={
                        (employee.employee_work_info.job_position_id as any)
                          ?.job_position || "Not Assigned"
                      }
                    />
                    <InfoRow
                      icon={User}
                      label="Years of Experience"
                      value={
                        employee.experience
                          ? `${employee.experience} Years`
                          : "Not specified"
                      }
                    />
                  </div>
                  <div className="divide-y divide-white/5">
                    <InfoRow
                      icon={Calendar}
                      label="Date of Joining"
                      value={
                        employee.employee_work_info.date_joining
                          ? new Date(
                              employee.employee_work_info.date_joining,
                            ).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : null
                      }
                    />
                    <InfoRow
                      icon={MapPin}
                      label="Primary Location"
                      value={
                        employee.employee_work_info.location || "On-site HQ"
                      }
                    />
                    <InfoRow
                      icon={BadgeCheck}
                      label="Employment Status"
                      value={isActive ? "Full-time Permanent" : "Inactive"}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertTriangle className="size-8 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No work information recorded yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "contact" && (
          <Card className="glass-card overflow-hidden border-white/10 shadow-lg">
            <CardHeader className="bg-white/5 border-b border-white/5">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-500" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-white/5 pt-4">
              <InfoRow
                icon={User}
                label="Contact Name"
                value={employee.emergency_contact_name}
              />
              <InfoRow
                icon={Phone}
                label="Contact Number"
                value={employee.emergency_contact}
              />
              <InfoRow
                icon={User}
                label="Relationship"
                value={employee.emergency_contact_relation}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
