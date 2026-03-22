import mongoose from "mongoose";

const WORK_RECORD_TYPES = ["FDP", "HDP", "ABS", "HD", "CONF", "DFT"];

const WorkRecordSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, required: true },
    work_record_type: {
      type: String,
      enum: WORK_RECORD_TYPES,
      default: "FDP",
    },
    min_hour: { type: String, default: "00:00" },
    at_work: { type: String, default: "00:00" },
    overtime: { type: String, default: "00:00" },
    is_attendance_record: { type: Boolean, default: false },
    is_leave_record: { type: Boolean, default: false },
    note: { type: String, default: null },
    last_update: { type: Date, default: null },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

WorkRecordSchema.index({ employee_id: 1, date: 1 }, { unique: true });

export default mongoose.models.WorkRecord ||
  mongoose.model("WorkRecord", WorkRecordSchema);
