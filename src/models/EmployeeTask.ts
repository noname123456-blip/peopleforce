import mongoose from "mongoose";

const STATUSES = ["todo", "in_progress", "stuck", "completed"];

const EmployeeTaskSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OffboardingEmployee",
      default: null,
    },
    status: { type: String, enum: STATUSES, default: "todo" },
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OffboardingTask",
      required: true,
    },
    description: { type: String, default: null },
  },
  { timestamps: true }
);

EmployeeTaskSchema.index({ employee_id: 1, task_id: 1 }, { unique: true });

export default mongoose.models.EmployeeTask ||
  mongoose.model("EmployeeTask", EmployeeTaskSchema);
