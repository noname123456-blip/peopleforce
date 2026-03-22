import mongoose from "mongoose";

const LEAVE_STATUS = ["requested", "approved", "cancelled", "rejected"];
const BREAKDOWN = ["full_day", "first_half", "second_half"];

const LeaveRequestSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    leave_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveType",
      required: true,
    },
    start_date: { type: Date, required: true },
    start_date_breakdown: {
      type: String,
      enum: BREAKDOWN,
      default: "full_day",
    },
    end_date: { type: Date, default: null },
    end_date_breakdown: {
      type: String,
      enum: BREAKDOWN,
      default: "full_day",
    },
    requested_days: { type: Number, default: null },
    leave_clashes_count: { type: Number, default: 0 },
    description: { type: String, required: true },
    attachment: { type: String, default: null },
    status: {
      type: String,
      enum: LEAVE_STATUS,
      default: "requested",
    },
    requested_date: { type: Date, default: Date.now },
    approved_available_days: { type: Number, default: 0 },
    approved_carryforward_days: { type: Number, default: 0 },
    reject_reason: { type: String, default: "" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

export default mongoose.models.LeaveRequest ||
  mongoose.model("LeaveRequest", LeaveRequestSchema);
