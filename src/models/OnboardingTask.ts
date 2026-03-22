import mongoose from "mongoose";

const OnboardingTaskSchema = new mongoose.Schema(
  {
    task_title: { type: String, required: true },
    stage_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OnboardingStage",
      default: null,
    },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
    employee_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  },
  { timestamps: true }
);

export default mongoose.models.OnboardingTask ||
  mongoose.model("OnboardingTask", OnboardingTaskSchema);
