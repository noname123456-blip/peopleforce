import mongoose from "mongoose";

const EmployeeShiftSchema = new mongoose.Schema(
  {
    employee_shift: { type: String, required: true },
    days: [{ type: mongoose.Schema.Types.ObjectId, ref: "EmployeeShiftDay" }],
    weekly_full_time: { type: String, default: "40:00" },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.EmployeeShift ||
  mongoose.model("EmployeeShift", EmployeeShiftSchema);
