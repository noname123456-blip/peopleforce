import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    attendance_date: { type: Date, required: true },
    shift_id: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeShift" },
    work_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "WorkType" },
    attendance_day: { type: mongoose.Schema.Types.ObjectId, ref: "EmployeeShiftDay" },
    attendance_clock_in_date: { type: Date, default: null },
    attendance_clock_in: { type: String, default: null },
    attendance_clock_out_date: { type: Date, default: null },
    attendance_clock_out: { type: String, default: null },
    attendance_worked_hour: { type: String, default: "00:00" },
    minimum_hour: { type: String, default: "00:00" },
    attendance_overtime: { type: String, default: "00:00" },
    attendance_overtime_approve: { type: Boolean, default: false },
    attendance_validated: { type: Boolean, default: false },
    at_work_second: { type: Number, default: null },
    overtime_second: { type: Number, default: null },
    approved_overtime_second: { type: Number, default: 0 },
    is_holiday: { type: Boolean, default: false },
    approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

AttendanceSchema.index({ employee_id: 1, attendance_date: 1 }, { unique: true });

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);
