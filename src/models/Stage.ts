import mongoose from "mongoose";

const STAGE_TYPES = ["initial", "applied", "test", "interview", "cancelled", "hired"];

const StageSchema = new mongoose.Schema(
  {
    recruitment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruitment",
      required: true,
    },
    stage_managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    stage: { type: String, required: true },
    stage_type: { type: String, enum: STAGE_TYPES, default: "interview" },
    sequence: { type: Number, default: 0 },
  },
  { timestamps: true }
);

StageSchema.index({ recruitment_id: 1, stage: 1 }, { unique: true });

export default mongoose.models.Stage || mongoose.model("Stage", StageSchema);
