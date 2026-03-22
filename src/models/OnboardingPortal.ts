import mongoose from "mongoose";

const OnboardingPortalSchema = new mongoose.Schema(
  {
    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
      unique: true,
    },
    token: { type: String, required: true, maxlength: 200 },
    used: { type: Boolean, default: false },
    count: { type: Number, default: 0 },
    profile: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.OnboardingPortal ||
  mongoose.model("OnboardingPortal", OnboardingPortalSchema);
