"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiRequest } from "@/utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Building2,
  Briefcase,
  MapPin,
  Clock,
  BadgeCheck,
  FileText,
  Users,
  Award,
  TrendingUp,
  CreditCard,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditProfileDialog } from "@/components/employees/EditProfileDialog";
import { DeleteConfirmDialog } from "@/components/ConfirmDialog";
import { useDelete } from "@/hooks/use-delete";

interface EmployeeProfile {
  _id: string;
  employee_first_name: string;
  employee_last_name?: string;
  email: string;
  phone?: string;
  badge_id?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  is_active?: boolean;
  employee_profile?: string;
  employee_work_info?: {
    department_id?: { department?: string } | null;
    job_position_id?: { job_position?: string } | null;
    job_role_id?: { job_role?: string } | null;
    date_joining?: string;
    company_id?: { company?: string } | null;
    work_type_id?: { work_type?: string } | null;
    shift_id?: { employee_shift?: string } | null;
    reporting_manager_id?: {
      employee_first_name?: string;
      employee_last_name?: string;
    } | null;
  } | null;
  employee_bank_details?: {
    bank_name?: string;
    account_number?: string;
  } | null;
}

function getInitials(first: string, last?: string) {
  return ((first?.[0] || "") + (last?.[0] || "")).toUpperCase() || "?";
}

function getAvatarGradient(name: string) {
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-blue-600",
  ];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return gradients[idx % gradients.length];
}

function InfoItem({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: any;
  label: string;
  value: string | undefined | null;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors",
        className,
      )}
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold mt-0.5 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-all">
      <div
        className={cn(
          "flex size-10 items-center justify-center rounded-lg",
          bg,
        )}
      >
        <Icon className={cn("size-5", color)} />
      </div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { delete: archiveEmployee } = useDelete("/employees");

  const fetchProfile = () => {
    if (!user) return;
    setLoading(true);
    apiRequest(
      "GET",
      `/employees?search=${encodeURIComponent(user.email)}&limit=1`,
    )
      .then((res) => {
        const match = res?.data?.[0] || null;
        setEmployee(match);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleDelete = async () => {
    if (!employee?._id) return;
    const result = await archiveEmployee(employee._id);
    if (result) {
      window.location.reload();
    }
  };

  const fullName = employee
    ? `${employee.employee_first_name} ${employee.employee_last_name || ""}`.trim()
    : user?.username || "User";

  const initials = employee
    ? getInitials(employee.employee_first_name, employee.employee_last_name)
    : user?.username?.[0]?.toUpperCase() || "?";

  const department =
    typeof employee?.employee_work_info?.department_id === "object"
      ? employee?.employee_work_info?.department_id?.department
      : undefined;

  const position =
    typeof employee?.employee_work_info?.job_position_id === "object"
      ? employee?.employee_work_info?.job_position_id?.job_position
      : undefined;

  const jobRole =
    typeof employee?.employee_work_info?.job_role_id === "object"
      ? employee?.employee_work_info?.job_role_id?.job_role
      : undefined;

  const company =
    typeof employee?.employee_work_info?.company_id === "object"
      ? employee?.employee_work_info?.company_id?.company
      : undefined;

  const manager = employee?.employee_work_info?.reporting_manager_id
    ? `${employee.employee_work_info.reporting_manager_id.employee_first_name || ""} ${employee.employee_work_info.reporting_manager_id.employee_last_name || ""}`.trim()
    : undefined;

  const joinDate = employee?.employee_work_info?.date_joining
    ? new Date(employee.employee_work_info.date_joining).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      )
    : undefined;

  const daysInCompany = employee?.employee_work_info?.date_joining
    ? Math.floor(
        (Date.now() -
          new Date(employee.employee_work_info.date_joining).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 size-64 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 size-48 rounded-full bg-violet-500/15 blur-[80px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            {loading ? (
              <Skeleton className="size-28 rounded-2xl" />
            ) : (
              <div
                className={cn(
                  "flex size-28 items-center justify-center rounded-2xl bg-linear-to-br text-white text-4xl font-black shadow-xl ring-4 ring-white/10",
                  getAvatarGradient(fullName),
                )}
              >
                {initials}
              </div>
            )}

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-9 w-48" />
                  <Skeleton className="h-5 w-32" />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    {fullName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    {position && (
                      <Badge className="bg-white/10 text-white/90 border-white/10 hover:bg-white/15 text-sm px-3 py-1">
                        {position}
                      </Badge>
                    )}
                    {department && (
                      <Badge
                        variant="outline"
                        className="border-white/20 text-white/70 text-sm px-3 py-1"
                      >
                        {department}
                      </Badge>
                    )}
                    <Badge
                      className={cn(
                        "text-[11px] px-3 py-1",
                        employee?.is_active !== false
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30",
                      )}
                    >
                      {employee?.is_active !== false
                        ? "● Active"
                        : "● Inactive"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="size-4" />
                      {employee?.email || user?.email}
                    </span>
                    {employee?.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-4" />
                        {employee.phone}
                      </span>
                    )}
                    {employee?.badge_id && (
                      <span className="flex items-center gap-1.5">
                        <BadgeCheck className="size-4" />
                        {employee.badge_id}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20 gap-2"
                onClick={() => setEditOpen(true)}
              >
                <Edit className="size-4" />
                Edit Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20 gap-2"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" />
                Archive
              </Button>
            </div>

            {/* Role badge */}
            <div className="hidden md:flex flex-col items-center gap-2">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/20 ring-2 ring-primary/30">
                <Shield className="size-7 text-primary" />
              </div>
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                {user?.role || "Employee"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="Join Date"
          value={joinDate || "N/A"}
          color="text-blue-500"
          bg="bg-blue-50 dark:bg-blue-950/50"
        />
        <StatCard
          icon={TrendingUp}
          label="Days in Company"
          value={daysInCompany > 0 ? daysInCompany : "N/A"}
          color="text-emerald-500"
          bg="bg-emerald-50 dark:bg-emerald-950/50"
        />
        <StatCard
          icon={Building2}
          label="Company"
          value={company || "N/A"}
          color="text-violet-500"
          bg="bg-violet-50 dark:bg-violet-950/50"
        />
        <StatCard
          icon={Award}
          label="Badge ID"
          value={employee?.badge_id || "N/A"}
          color="text-amber-500"
          bg="bg-amber-50 dark:bg-amber-950/50"
        />
      </div>

      {/* Detail Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card className="overflow-hidden border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-4 text-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem icon={User} label="Full Name" value={fullName} />
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={employee?.email || user?.email}
                />
                <InfoItem icon={Phone} label="Phone" value={employee?.phone} />
                <InfoItem icon={User} label="Gender" value={employee?.gender} />
                <InfoItem
                  icon={Calendar}
                  label="Date of Birth"
                  value={
                    employee?.date_of_birth
                      ? new Date(employee.date_of_birth).toLocaleDateString()
                      : undefined
                  }
                />
                <InfoItem
                  icon={MapPin}
                  label="Address"
                  value={employee?.address}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card className="overflow-hidden border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="size-4 text-primary" />
              Work Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={Building2}
                  label="Department"
                  value={department}
                />
                <InfoItem icon={Briefcase} label="Position" value={position} />
                <InfoItem icon={Award} label="Job Role" value={jobRole} />
                <InfoItem icon={Calendar} label="Join Date" value={joinDate} />
                <InfoItem
                  icon={Users}
                  label="Reporting Manager"
                  value={manager}
                />
                <InfoItem icon={Building2} label="Company" value={company} />
                <InfoItem
                  icon={Clock}
                  label="Shift"
                  value={
                    typeof employee?.employee_work_info?.shift_id === "object"
                      ? employee?.employee_work_info?.shift_id?.employee_shift
                      : undefined
                  }
                />
                <InfoItem
                  icon={Briefcase}
                  label="Work Type"
                  value={
                    typeof employee?.employee_work_info?.work_type_id ===
                    "object"
                      ? employee?.employee_work_info?.work_type_id?.work_type
                      : undefined
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="overflow-hidden border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4 text-primary" />
              Bank Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem
                  icon={CreditCard}
                  label="Bank Name"
                  value={employee?.employee_bank_details?.bank_name}
                />
                <InfoItem
                  icon={FileText}
                  label="Account Number"
                  value={
                    employee?.employee_bank_details?.account_number
                      ? "••••" +
                        employee.employee_bank_details.account_number.slice(-4)
                      : undefined
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="overflow-hidden border-border/50 shadow-sm">
          <CardHeader className="bg-muted/30 pb-3 border-b border-border/50">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="size-4 text-primary" />
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem icon={User} label="Username" value={user?.username} />
              <InfoItem icon={Mail} label="Login Email" value={user?.email} />
              <InfoItem icon={Shield} label="System Role" value={user?.role} />
              <InfoItem
                icon={BadgeCheck}
                label="Verification"
                value={user?.isVerified ? "Verified ✓" : "Not Verified"}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        employee={employee}
        onSuccess={fetchProfile}
      />

      <DeleteConfirmDialog
        isOpen={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName="your profile"
      />
    </div>
  );
}
