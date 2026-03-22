import mongoose from "mongoose";

const OnboardingStageSchema = new mongoose.Schema(
  {
    stage_title: { type: String, required: true },
    recruitment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruitment",
      default: null,
    },
    employee_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    sequence: { type: Number, default: null },
    is_final_stage: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.OnboardingStage ||
  mongoose.model("OnboardingStage", OnboardingStageSchema);
