import mongoose from "mongoose";

const COMPENSATION_CHOICES = ["salary", "hourly", "commission"];
const PAY_FREQUENCY_CHOICES = ["weekly", "biweekly", "monthly", "semi_monthly"];
const CONTRACT_STATUS = ["draft", "active", "expired", "terminated"];

const ContractSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    contract_name: { type: String, required: true, maxlength: 100 },
    contract_start_date: { type: Date, required: true },
    contract_end_date: { type: Date, default: null },
    wage: { type: Number, default: 0 },
    wage_type: {
      type: String,
      enum: COMPENSATION_CHOICES,
      default: "salary",
    },
    pay_frequency: {
      type: String,
      enum: PAY_FREQUENCY_CHOICES,
      default: "monthly",
    },
    filing_status: { type: String, default: null },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    job_position_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosition",
      default: null,
    },
    job_role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobRole",
      default: null,
    },
    shift_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeShift",
      default: null,
    },
    work_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkType",
      default: null,
    },
    basic_salary: { type: Number, default: 0 },
    salary_hour: { type: Number, default: 0 },
    notice_period_in_days: { type: Number, default: 0 },
    status: { type: String, enum: CONTRACT_STATUS, default: "draft" },
    note: { type: String, default: null },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

ContractSchema.index(
  { employee_id: 1, contract_start_date: 1, contract_end_date: 1 },
  { unique: true }
);

export default mongoose.models.Contract ||
  mongoose.model("Contract", ContractSchema);
