import mongoose from "mongoose";

const TYPES = [
  "notice_period",
  "fnf",
  "other",
  "interview",
  "handover",
  "archived",
];

const OffboardingStageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: TYPES, required: true },
    offboarding_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offboarding",
      required: true,
    },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    sequence: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.OffboardingStage ||
  mongoose.model("OffboardingStage", OffboardingStageSchema);
