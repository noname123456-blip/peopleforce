import mongoose from "mongoose";

const CandidateStageSchema = new mongoose.Schema(
  {
    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      unique: true,
    },
    onboarding_stage_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OnboardingStage",
      required: true,
    },
    onboarding_end_date: { type: Date, default: null },
    sequence: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.CandidateStage ||
  mongoose.model("CandidateStage", CandidateStageSchema);
