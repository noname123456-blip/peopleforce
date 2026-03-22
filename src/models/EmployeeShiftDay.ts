import mongoose from "mongoose";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const EmployeeShiftDaySchema = new mongoose.Schema(
  {
    day: { type: String, enum: DAYS, required: true },
    company_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  },
  { timestamps: true }
);

export default mongoose.models.EmployeeShiftDay ||
  mongoose.model("EmployeeShiftDay", EmployeeShiftDaySchema);
