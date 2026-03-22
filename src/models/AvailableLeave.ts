import mongoose from "mongoose";

const AvailableLeaveSchema = new mongoose.Schema(
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
    available_days: { type: Number, default: 0 },
    carryforward_days: { type: Number, default: 0 },
    total_leave_days: { type: Number, default: 0 },
    assigned_date: { type: Date, default: Date.now },
    reset_date: { type: Date, default: null },
    expired_date: { type: Date, default: null },
  },
  { timestamps: true }
);

AvailableLeaveSchema.index(
  { leave_type_id: 1, employee_id: 1 },
  { unique: true }
);

export default mongoose.models.AvailableLeave ||
  mongoose.model("AvailableLeave", AvailableLeaveSchema);
