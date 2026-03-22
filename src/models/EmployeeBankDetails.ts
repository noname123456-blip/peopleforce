import mongoose from "mongoose";

const EmployeeBankDetailsSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },
    bank_name: { type: String, required: true },
    account_number: { type: String },
    branch: { type: String, default: null },
    address: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    any_other_code1: { type: String, default: null },
    any_other_code2: { type: String, default: null },
    additional_info: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.EmployeeBankDetails ||
  mongoose.model("EmployeeBankDetails", EmployeeBankDetailsSchema);
