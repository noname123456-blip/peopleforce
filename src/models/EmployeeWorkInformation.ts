import mongoose from "mongoose";

const EmployeeWorkInformationSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },
    department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    job_position_id: { type: mongoose.Schema.Types.ObjectId, ref: "JobPosition" },
    job_role_id: { type: mongoose.Schema.Types.ObjectId, ref: "JobRole" },
    reporting_manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    shift_id: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeShift" },
    work_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "WorkType" },
    employee_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeType" },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "EmployeeTag" }],
    location: { type: String, default: null },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    email: { type: String, default: null },
    mobile: { type: String, default: null },
    date_joining: { type: Date, default: null },
    contract_end_date: { type: Date, default: null },
    basic_salary: { type: Number, default: 0 },
    salary_hour: { type: Number, default: 0 },
    additional_info: { type: mongoose.Schema.Types.Mixed, default: null },
    experience: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.EmployeeWorkInformation ||
  mongoose.model("EmployeeWorkInformation", EmployeeWorkInformationSchema);
