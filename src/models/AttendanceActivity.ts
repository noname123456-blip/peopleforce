import mongoose from "mongoose";

const AttendanceActivitySchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    attendance_date: { type: Date, required: true },
    shift_day: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeShiftDay" },
    in_datetime: { type: Date, default: null },
    clock_in_date: { type: Date, default: null },
    clock_in: { type: String, required: true },
    clock_out_date: { type: Date, default: null },
    out_datetime: { type: Date, default: null },
    clock_out: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.AttendanceActivity ||
  mongoose.model("AttendanceActivity", AttendanceActivitySchema);
