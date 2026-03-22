import mongoose from "mongoose";

const UNIT = ["day", "month"];

const OffboardingEmployeeSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },
    stage_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OffboardingStage",
      default: null,
    },
    notice_period: { type: Number, default: null },
    unit: { type: String, enum: UNIT, default: "month" },
    notice_period_starts: { type: Date, default: null },
    notice_period_ends: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.OffboardingEmployee ||
  mongoose.model("OffboardingEmployee", OffboardingEmployeeSchema);
