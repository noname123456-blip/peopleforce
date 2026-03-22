import mongoose from "mongoose";

const BASED_ON = ["basic_pay", "gross_pay", "taxable_gross_pay"];
const CONDITION_FIELD = ["basic_pay", "gross_pay", "experience", "children"];
const CONDITION_OP = ["equal", "notequal", "lt", "gt", "le", "ge"];

const DeductionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 100 },
    include_active_employees: { type: Boolean, default: false },
    specific_employees: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    ],
    is_pretax: { type: Boolean, default: true },
    is_fixed: { type: Boolean, default: true },
    amount: { type: Number, default: 0 },
    based_on: { type: String, enum: BASED_ON, default: "basic_pay" },
    rate: { type: Number, default: 0 },
    is_condition_based: { type: Boolean, default: false },
    field: { type: String, enum: CONDITION_FIELD, default: null },
    condition: { type: String, enum: CONDITION_OP, default: null },
    value: { type: mongoose.Schema.Types.Mixed, default: null },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.Deduction ||
  mongoose.model("Deduction", DeductionSchema);
