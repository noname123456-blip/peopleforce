import mongoose from "mongoose";

const STATUS_CHOICES = ["On Track", "Behind", "Closed", "At Risk", "Not Started"];
const PROGRESS_CHOICES = ["%", "#", "$", "₹", "€"];
const KR_STATUS_CHOICES = ["On Track", "Behind", "Closed", "At Risk", "Not Started"];

const EmployeeKeyResultSchema = new mongoose.Schema({
  key_result_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KeyResult",
    required: true,
  },
  current_value: { type: Number, default: 0 },
  target_value: { type: Number, default: 100 },
  start_value: { type: Number, default: 0 },
  progress_percentage: { type: Number, default: 0 },
  status: { type: String, enum: KR_STATUS_CHOICES, default: "Not Started" },
});

const EmployeeObjectiveSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    objective_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PMSObjective",
      required: true,
    },
    status: { type: String, enum: STATUS_CHOICES, default: "Not Started" },
    progress_percentage: { type: Number, default: 0 },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    key_results: [EmployeeKeyResultSchema],
  },
  { timestamps: true }
);

EmployeeObjectiveSchema.index(
  { employee_id: 1, objective_id: 1 },
  { unique: true }
);

export default mongoose.models.EmployeeObjective ||
  mongoose.model("EmployeeObjective", EmployeeObjectiveSchema);
