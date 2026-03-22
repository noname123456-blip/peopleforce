import mongoose from "mongoose";

const DURATION_UNIT = ["days", "months", "years"];

const PMSObjectiveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 150 },
    description: { type: String, default: null },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    key_result_ids: [
      { type: mongoose.Schema.Types.ObjectId, ref: "KeyResult" },
    ],
    start_date: { type: Date, default: null },
    duration: { type: Number, default: 0 },
    duration_unit: { type: String, enum: DURATION_UNIT, default: "months" },
    self_employee_progress_update: { type: Boolean, default: true },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PMSObjective ||
  mongoose.model("PMSObjective", PMSObjectiveSchema);
