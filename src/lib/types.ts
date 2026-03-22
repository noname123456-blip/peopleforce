/**
 * Shared types and enums for HR clone (aligned with Django source)
 */

export const ROLES = ["ADMIN", "HR_MANAGER", "MANAGER", "EMPLOYEE"] as const;
export type Role = (typeof ROLES)[number];

export const GENDER_CHOICES = ["male", "female", "other"] as const;
export type Gender = (typeof GENDER_CHOICES)[number];

export const MARITAL_CHOICES = ["single", "married", "divorced"] as const;
export type MaritalStatus = (typeof MARITAL_CHOICES)[number];

export const LEAVE_STATUS = ["requested", "approved", "cancelled", "rejected"] as const;
export type LeaveStatus = (typeof LEAVE_STATUS)[number];

export const LEAVE_BREAKDOWN = ["full_day", "first_half", "second_half"] as const;
export type LeaveBreakdown = (typeof LEAVE_BREAKDOWN)[number];

export const STAGE_TYPES = [
  "initial",
  "applied",
  "test",
  "interview",
  "cancelled",
  "hired",
] as const;
export type StageType = (typeof STAGE_TYPES)[number];

export const OFFER_LETTER_STATUSES = [
  "not_sent",
  "sent",
  "accepted",
  "rejected",
  "joined",
] as const;
export type OfferLetterStatus = (typeof OFFER_LETTER_STATUSES)[number];

export const CANDIDATE_TASK_STATUS = ["todo", "scheduled", "ongoing", "stuck", "done"] as const;
export type CandidateTaskStatus = (typeof CANDIDATE_TASK_STATUS)[number];

export const OFFBOARDING_STAGE_TYPES = [
  "notice_period",
  "fnf",
  "other",
  "interview",
  "handover",
  "archived",
] as const;
export type OffboardingStageType = (typeof OFFBOARDING_STAGE_TYPES)[number];

export const EMPLOYEE_TASK_STATUS = ["todo", "in_progress", "stuck", "completed"] as const;
export type EmployeeTaskStatus = (typeof EMPLOYEE_TASK_STATUS)[number];

export const RESIGNATION_STATUSES = ["requested", "approved", "rejected"] as const;
export type ResignationStatus = (typeof RESIGNATION_STATUSES)[number];

// ── Payroll ──
export const COMPENSATION_CHOICES = ["salary", "hourly", "commission"] as const;
export type CompensationType = (typeof COMPENSATION_CHOICES)[number];

export const PAY_FREQUENCY = ["weekly", "biweekly", "monthly", "semi_monthly"] as const;
export type PayFrequency = (typeof PAY_FREQUENCY)[number];

export const CONTRACT_STATUS = ["draft", "active", "expired", "terminated"] as const;
export type ContractStatus = (typeof CONTRACT_STATUS)[number];

export const PAYSLIP_STATUS = ["draft", "review_ongoing", "confirmed", "paid"] as const;
export type PayslipStatus = (typeof PAYSLIP_STATUS)[number];

export const WORK_RECORD_TYPES = ["FDP", "HDP", "ABS", "HD", "CONF", "DFT"] as const;
export type WorkRecordType = (typeof WORK_RECORD_TYPES)[number];

// ── Asset ──
export const ASSET_STATUS = ["In use", "Available", "Not-Available"] as const;
export type AssetStatus = (typeof ASSET_STATUS)[number];

export const ASSET_RETURN_STATUS = ["Healthy", "Minor damage", "Major damage"] as const;
export type AssetReturnStatus = (typeof ASSET_RETURN_STATUS)[number];

export const ASSET_REQUEST_STATUS = ["requested", "approved", "rejected", "cancelled"] as const;
export type AssetRequestStatus = (typeof ASSET_REQUEST_STATUS)[number];

// ── Helpdesk ──
export const TICKET_TYPES = ["general", "leave", "attendance", "others"] as const;
export type TicketTypeStr = (typeof TICKET_TYPES)[number];

export const TICKET_PRIORITY = ["low", "medium", "high", "critical"] as const;
export type TicketPriority = (typeof TICKET_PRIORITY)[number];

export const TICKET_STATUS = ["new", "in_progress", "on_hold", "resolved", "canceled"] as const;
export type TicketStatus = (typeof TICKET_STATUS)[number];

// ── PMS ──
export const PMS_OBJECTIVE_STATUS = ["On Track", "Behind", "Closed", "At Risk", "Not Started"] as const;
export type PMSObjectiveStatus = (typeof PMS_OBJECTIVE_STATUS)[number];

export const PMS_PROGRESS_TYPES = ["%", "#", "$", "₹", "€"] as const;
export type PMSProgressType = (typeof PMS_PROGRESS_TYPES)[number];

export const PMS_FEEDBACK_STATUS = ["draft", "submitted", "acknowledged"] as const;
export type PMSFeedbackStatus = (typeof PMS_FEEDBACK_STATUS)[number];
