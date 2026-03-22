import mongoose from "mongoose";

const EmployeeTypeSchema = new mongoose.Schema(
  {
    employee_type: { type: String, required: true },
    company_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  },
  { timestamps: true }
);

export default mongoose.models.EmployeeType ||
  mongoose.model("EmployeeType", EmployeeTypeSchema);
