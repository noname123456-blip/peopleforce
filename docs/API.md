# HR Clone – API Overview

All API routes require authentication via the `token` cookie (JWT) unless noted.  
Role-based access: `ADMIN`, `HR_MANAGER`, `MANAGER`, `EMPLOYEE`.

## Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/user/auth/login` | Login (body: `email`, `password`) |
| POST | `/api/user/auth/signup` | Signup (body: `username`, `email`, `password`) |
| GET  | `/api/user/auth/logout` | Clear token cookie |
| GET  | `/api/auth/me` | Current user (id, username, email, role) |

## Dashboard

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard` | Metrics: employeeCount, attendanceRate, leaveRequestsPending, openRecruitments |

## Employees

| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/api/employees` | List (query: `page`, `limit`, `search`) | Manager+ |
| POST | `/api/employees` | Create employee | Manager+ |
| GET | `/api/employees/[id]` | Get one (with work info) | Manager+ or own profile |
| PUT | `/api/employees/[id]` | Update | Manager+ |
| DELETE | `/api/employees/[id]` | Archive (set is_active false) | Manager+ |

## Recruitment

| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/api/recruitment` | List open recruitments | HR/Admin |

## Leave

| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/api/leave/requests` | List leave requests | HR/Manager: all; Employee: own |

## Attendance

| Method | Path | Description | Access |
|--------|------|-------------|--------|
| GET | `/api/attendance` | List (query: `month`, `employee_id`) | HR/Manager: all; Employee: own |

## RBAC

- **ADMIN** – Full access.
- **HR_MANAGER** – Employees, Recruitment, Onboarding, Attendance, Leave, Offboarding.
- **MANAGER** – Employees (view/manage), Attendance, Leave.
- **EMPLOYEE** – Own profile, own leave, own attendance.

Middleware protects all non-public routes; public paths: `/login`, `/signup`, `/verifyemail`.
