import mongoose from "mongoose";

const PAYSLIP_STATUS = ["draft", "review_ongoing", "confirmed", "paid"];

const PayslipSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    contract_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contract",
      default: null,
    },
    basic_pay: { type: Number, default: 0 },
    gross_pay: { type: Number, default: 0 },
    net_pay: { type: Number, default: 0 },
    total_deductions: { type: Number, default: 0 },
    total_allowances: { type: Number, default: 0 },
    tax_deduction: { type: Number, default: 0 },
    working_days: { type: Number, default: 0 },
    paid_days: { type: Number, default: 0 },
    unpaid_days: { type: Number, default: 0 },
    pay_head_data: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: PAYSLIP_STATUS, default: "draft" },
    sent_to_employee: { type: Boolean, default: false },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

PayslipSchema.index({ employee_id: 1, start_date: 1, end_date: 1 }, { unique: true });

export default mongoose.models.Payslip ||
  mongoose.model("Payslip", PayslipSchema);
