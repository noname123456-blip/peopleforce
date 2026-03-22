import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ClipboardList,
  CalendarCheck,
  CalendarDays,
  LogOut,
  Wallet,
  Package,
  Headset,
  Target,
  Dot,
} from "lucide-react";
import type { Role } from "./types";
import {
  canManageEmployees,
  canManageRecruitment,
  canManageOnboarding,
  canManageAttendance,
  canManageLeave,
  canManageOffboarding,
  canManagePayroll,
  canManageAssets,
  canManageHelpdesk,
  canManagePMS,
} from "./rbac";

const icon = (C: React.ComponentType<{ className?: string }>) => (
  <C className="size-[18px] shrink-0" />
);

export interface SidebarSubItem {
  label: string;
  href: string;
  check?: (role: Role) => boolean;
}

export interface SidebarItem {
  label: string;
  href?: string;
  icon: ReactNode;
  check: (role: Role) => boolean;
  subItems?: SidebarSubItem[];
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: icon(LayoutDashboard),
    check: () => true,
  },
  {
    label: "Recruitment",
    icon: icon(UserPlus),
    check: canManageRecruitment,
    subItems: [
      { label: "Dashboard", href: "/recruitment/dashboard" },
      { label: "Pipeline", href: "/recruitment/pipeline" },
      { label: "Survey Templates", href: "/recruitment/survey" },
      { label: "Candidates", href: "/recruitment/candidates" },
      { label: "Interviews", href: "/recruitment/interviews" },
      { label: "Recruitments", href: "/recruitment/jobs" },
      { label: "Open Jobs", href: "/recruitment/open-jobs" },
      { label: "Skill Zone", href: "/recruitment/skill-zone" },
    ],
  },
  {
    label: "Employee",
    icon: icon(Users),
    check: () => true,
    subItems: [
      { label: "My Profile", href: "/profile" },
      { label: "All Employees", href: "/employees", check: canManageEmployees },
      {
        label: "Create",
        href: "/employees?create=true",
        check: canManageEmployees,
      },
      {
        label: "Documents",
        href: "/employees/documents",
        check: canManageEmployees,
      },
      {
        label: "Policies",
        href: "/employees/policies",
        check: canManageEmployees,
      },
      {
        label: "Org Chart",
        href: "/employees/org-chart",
        check: canManageEmployees,
      },
    ],
  },
  {
    label: "Onboarding",
    icon: icon(ClipboardList),
    check: canManageOnboarding,
    subItems: [
      { label: "Overview", href: "/onboarding" },
      { label: "Candidates", href: "/onboarding/candidates" },
      { label: "Stages", href: "/onboarding/stages" },
      { label: "Tasks", href: "/onboarding/tasks" },
      { label: "New Hires", href: "/onboarding/new-hires" },
    ],
  },
  {
    label: "Attendance",
    icon: icon(CalendarCheck),
    check: () => true,
    subItems: [
      { label: "Dashboard", href: "/attendance/dashboard" },
      { label: "My Attendance", href: "/attendance/my" },
      { label: "Attendances", href: "/attendance", check: canManageAttendance },
      {
        label: "Requests",
        href: "/attendance/requests",
        check: canManageAttendance,
      },
      {
        label: "Hour Account",
        href: "/attendance/hour-account",
        check: canManageAttendance,
      },
      {
        label: "Work Records",
        href: "/attendance/work-records",
        check: canManageAttendance,
      },
      {
        label: "Activities",
        href: "/attendance/activities",
        check: canManageAttendance,
      },
      {
        label: "Late / Early Out",
        href: "/attendance/late-early",
        check: canManageAttendance,
      },
      {
        label: "Reports",
        href: "/attendance/reports",
        check: canManageAttendance,
      },
    ],
  },
  {
    label: "Leave",
    icon: icon(CalendarDays),
    check: () => true,
    subItems: [
      { label: "Dashboard", href: "/leave/dashboard" },
      { label: "My Requests", href: "/leave/my" },
      { label: "Request Leave", href: "/leave/my?request=true" },
      { label: "All Requests", href: "/leave/requests", check: canManageLeave },
      { label: "Leave Types", href: "/leave/types", check: canManageLeave },
      { label: "Leave Balance", href: "/leave/balance" },
      {
        label: "Assigned Leave",
        href: "/leave/assigned",
        check: canManageLeave,
      },
      { label: "Allocation", href: "/leave/allocation", check: canManageLeave },
      { label: "Holidays", href: "/leave/holidays", check: canManageLeave },
      {
        label: "Company Leaves",
        href: "/leave/company-leaves",
        check: canManageLeave,
      },
      { label: "Restrictions", href: "/leave/restrict", check: canManageLeave },
    ],
  },
  {
    label: "Payroll",
    icon: icon(Wallet),
    check: () => true,
    subItems: [
      {
        label: "Dashboard",
        href: "/payroll/dashboard",
        check: canManagePayroll,
      },
      { label: "My Payslips", href: "/payroll/my-payslips" },
      {
        label: "Contracts",
        href: "/payroll/contracts",
        check: canManagePayroll,
      },
      {
        label: "All Payslips",
        href: "/payroll/payslips",
        check: canManagePayroll,
      },
      {
        label: "Allowances",
        href: "/payroll/allowances",
        check: canManagePayroll,
      },
      {
        label: "Deductions",
        href: "/payroll/deductions",
        check: canManagePayroll,
      },
    ],
  },
  {
    label: "Assets",
    icon: icon(Package),
    check: () => true,
    subItems: [
      { label: "Dashboard", href: "/assets/dashboard", check: canManageAssets },
      { label: "My Assets", href: "/assets/my" },
      { label: "All Assets", href: "/assets", check: canManageAssets },
      {
        label: "Categories",
        href: "/assets/categories",
        check: canManageAssets,
      },
      {
        label: "Assignments",
        href: "/assets/assignments",
        check: canManageAssets,
      },
      { label: "My Requests", href: "/assets/my-requests" },
      {
        label: "All Requests",
        href: "/assets/requests",
        check: canManageAssets,
      },
    ],
  },
  {
    label: "Helpdesk",
    icon: icon(Headset),
    check: () => true,
    subItems: [
      {
        label: "Dashboard",
        href: "/helpdesk/dashboard",
        check: canManageHelpdesk,
      },
      { label: "My Tickets", href: "/helpdesk/my-tickets" },
      {
        label: "All Tickets",
        href: "/helpdesk/tickets",
        check: canManageHelpdesk,
      },
      {
        label: "Ticket Types",
        href: "/helpdesk/ticket-types",
        check: canManageHelpdesk,
      },
    ],
  },
  {
    label: "Performance",
    icon: icon(Target),
    check: () => true,
    subItems: [
      {
        label: "Dashboard",
        href: "/performance/dashboard",
        check: canManagePMS,
      },
      { label: "My Objectives", href: "/performance/my-objectives" },
      {
        label: "All Objectives",
        href: "/performance/objectives",
        check: canManagePMS,
      },
      { label: "Feedback", href: "/performance/feedback", check: canManagePMS },
      { label: "Periods", href: "/performance/periods", check: canManagePMS },
    ],
  },
  {
    label: "Offboarding",
    icon: icon(LogOut),
    check: canManageOffboarding,
    subItems: [
      { label: "Dashboard", href: "/offboarding/dashboard" },
      { label: "Exit Process", href: "/offboarding/exit" },
      { label: "Resignations", href: "/offboarding/resignations" },
    ],
  },
];
