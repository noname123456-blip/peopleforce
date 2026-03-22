import mongoose from "mongoose";

const STATUS = ["todo", "scheduled", "ongoing", "stuck", "done"];

const CandidateTaskSchema = new mongoose.Schema(
  {
    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    stage_id: { type: mongoose.Schema.Types.ObjectId, ref: "OnboardingStage" },
    status: { type: String, enum: STATUS, default: "todo" },
    onboarding_task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OnboardingTask",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.CandidateTask ||
  mongoose.model("CandidateTask", CandidateTaskSchema);
