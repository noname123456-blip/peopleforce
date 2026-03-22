import type { Role } from "./types";

/**
 * RBAC: Admin, HR Manager, Manager, Employee (aligned with Django source)
 * Permission levels: Admin > HR Manager > Manager > Employee
 */

export const ROLE_HIERARCHY: Record<Role, number> = {
  ADMIN: 4,
  HR_MANAGER: 3,
  MANAGER: 2,
  EMPLOYEE: 1,
};

export function hasMinimumRole(userRole: Role, required: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[required];
}

export function isAdmin(role: Role): boolean {
  return role === "ADMIN";
}

export function isHROrAdmin(role: Role): boolean {
  return role === "ADMIN" || role === "HR_MANAGER";
}

export function canManageEmployees(role: Role): boolean {
  return isHROrAdmin(role) || role === "MANAGER";
}

export function canManageRecruitment(role: Role): boolean {
  return isHROrAdmin(role);
}

export function canManageOnboarding(role: Role): boolean {
  return isHROrAdmin(role);
}

export function canManageAttendance(role: Role): boolean {
  return isHROrAdmin(role) || role === "MANAGER";
}

export function canManageLeave(role: Role): boolean {
  return isHROrAdmin(role) || role === "MANAGER";
}

export function canManageOffboarding(role: Role): boolean {
  return isHROrAdmin(role);
}

export function canManagePayroll(role: Role): boolean {
  return isHROrAdmin(role);
}

export function canManageAssets(role: Role): boolean {
  return isHROrAdmin(role) || role === "MANAGER";
}

export function canManageHelpdesk(role: Role): boolean {
  return isHROrAdmin(role) || role === "MANAGER";
}

export function canManagePMS(role: Role): boolean {
  return isHROrAdmin(role) || role === "MANAGER";
}

export function canAccessDashboard(role: Role): boolean {
  return true;
}
