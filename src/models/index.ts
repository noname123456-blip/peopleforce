/**
 * Central export for Mongoose models (HR Clone)
 * Use for API routes and server code.
 */

// ── Core ──
export { default as User } from "./User";
export { default as Company } from "./Company";
export { default as Department } from "./Department";
export { default as JobPosition } from "./JobPosition";
export { default as JobRole } from "./JobRole";
export { default as WorkType } from "./WorkType";
export { default as EmployeeType } from "./EmployeeType";
export { default as EmployeeShift } from "./EmployeeShift";
export { default as EmployeeShiftDay } from "./EmployeeShiftDay";

// ── Employee ──
export { default as Employee } from "./Employee";
export { default as EmployeeTag } from "./EmployeeTag";
export { default as EmployeeWorkInformation } from "./EmployeeWorkInformation";
export { default as EmployeeBankDetails } from "./EmployeeBankDetails";
export { default as OrgChart } from "./OrgChart";
export { default as Document } from "./Document";
export { default as Policy } from "./Policy";

// ── Recruitment ──
export { default as Recruitment } from "./Recruitment";
export { default as Skill } from "./Skill";
export { default as SurveyTemplate } from "./SurveyTemplate";
export { default as Stage } from "./Stage";
export { default as Candidate } from "./Candidate";
export { default as InterviewSchedule } from "./InterviewSchedule";
export { default as SkillZone } from "./SkillZone";

// ── Leave ──
export { default as LeaveType } from "./LeaveType";
export { default as AvailableLeave } from "./AvailableLeave";
export { default as LeaveRequest } from "./LeaveRequest";
export { default as Holiday } from "./Holiday";
export { default as CompanyLeave } from "./CompanyLeave";

// ── Attendance ──
export { default as Attendance } from "./Attendance";
export { default as AttendanceActivity } from "./AttendanceActivity";

// ── Onboarding ──
export { default as OnboardingStage } from "./OnboardingStage";
export { default as OnboardingTask } from "./OnboardingTask";
export { default as CandidateStage } from "./CandidateStage";
export { default as CandidateTask } from "./CandidateTask";
export { default as OnboardingPortal } from "./OnboardingPortal";

// ── Offboarding ──
export { default as Offboarding } from "./Offboarding";
export { default as OffboardingStage } from "./OffboardingStage";
export { default as OffboardingEmployee } from "./OffboardingEmployee";
export { default as OffboardingTask } from "./OffboardingTask";
export { default as EmployeeTask } from "./EmployeeTask";
export { default as ResignationLetter } from "./ResignationLetter";
export { default as ExitReason } from "./ExitReason";

// ── Payroll ──
export { default as Contract } from "./Contract";
export { default as WorkRecord } from "./WorkRecord";
export { default as Payslip } from "./Payslip";
export { default as Allowance } from "./Allowance";
export { default as Deduction } from "./Deduction";

// ── Asset ──
export { default as AssetCategory } from "./AssetCategory";
export { default as Asset } from "./Asset";
export { default as AssetAssignment } from "./AssetAssignment";
export { default as AssetRequest } from "./AssetRequest";

// ── Helpdesk ──
export { default as TicketType } from "./TicketType";
export { default as Ticket } from "./Ticket";
export { default as TicketComment } from "./TicketComment";

// ── PMS (Performance Management) ──
export { default as Period } from "./Period";
export { default as KeyResult } from "./KeyResult";
export { default as PMSObjective } from "./PMSObjective";
export { default as EmployeeObjective } from "./EmployeeObjective";
export { default as PMSFeedback } from "./PMSFeedback";
