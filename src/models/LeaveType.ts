import mongoose from "mongoose";

const PAYMENT = ["paid", "unpaid"];
const TIME_PERIOD = ["day", "month", "year"];
const RESET_BASED = ["yearly", "monthly", "weekly"];
const CARRYFORWARD = ["no carryforward", "carryforward", "carryforward expire"];

const LeaveTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, default: null },
    color: { type: String, default: null },
    payment: { type: String, enum: PAYMENT, default: "unpaid" },
    count: { type: Number, default: 1 },
    period_in: { type: String, enum: TIME_PERIOD, default: "day" },
    limit_leave: { type: Boolean, default: true },
    total_days: { type: Number, default: 1 },
    reset: { type: Boolean, default: false },
    reset_based: { type: String, enum: RESET_BASED, default: null },
    reset_month: { type: String, default: null },
    reset_day: { type: String, default: null },
    reset_weekend: { type: String, default: null },
    carryforward_type: {
      type: String,
      enum: CARRYFORWARD,
      default: "no carryforward",
    },
    carryforward_max: { type: Number, default: null },
    carryforward_expire_in: { type: Number, default: null },
    carryforward_expire_period: { type: String, default: null },
    carryforward_expire_date: { type: Date, default: null },
    require_approval: { type: String, default: "yes" },
    require_attachment: { type: String, default: "no" },
    exclude_company_leave: { type: String, default: "no" },
    exclude_holiday: { type: String, default: "no" },
    is_encashable: { type: Boolean, default: false },
    is_compensatory_leave: { type: Boolean, default: false },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.LeaveType ||
  mongoose.model("LeaveType", LeaveTypeSchema);
